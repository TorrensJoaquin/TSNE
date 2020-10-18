Option Explicit
Function TSNE(XasRange As Range, DesiredPerplexity As Double, NumberOfIterations As Long)
    Randomize
    Dim p() As Variant 'pj|i and later will be pji
    Dim q() As Variant 'qji
    Dim i As Long 'These are only going to help in the for loops
    Dim j As Long 'These are only going to help in the for loops
    Dim n As Long 'These are only going to help in the for loops
    Dim minusTwoSigmaSquared() As Variant
    Dim x() As Variant
    Dim numberOfSamplesInX As Long
    Dim iter As Long
    Dim Sumq As Double
    Dim dCdYi() As Variant
    Dim aux() As Variant
    Dim numberOfDimentions As Long
    Dim y() As Variant
    '
    x = XasRange.Value2
    Set XasRange = Nothing
    '
    numberOfSamplesInX = UBound(x, 1)
    ReDim minusTwoSigmaSquared(1 To numberOfSamplesInX)
    '
    numberOfDimentions = UBound(x, 2)
    'Compute Non Symetric Pair Wise Affinities [pj|i] with perplexity [Per]
    'pj|i=exp(-||xi-xj||^2/2Sigma^2)/Sum(exp(-||xi-xk||^2/2Sigma^2))
    'Perp(Pi)=2^H(Pi)
    'H(Pi)=-Sum(pj|i)*log2(pj|i)
    ''Falta la busqueda binaria, Es por renglon así que va dentro de la función.
    ReDim p(1 To numberOfSamplesInX, 1 To numberOfSamplesInX)
    minusTwoSigmaSquared = SearchMeForFixedPerpexity(x, numberOfSamplesInX, numberOfDimentions, DesiredPerplexity)
    p = getMeThePairWiseAffinities(x, numberOfSamplesInX, numberOfDimentions, minusTwoSigmaSquared)
    'Set pij= ( pj|i + pi|j ) / 2 * n
    For i = 2 To numberOfSamplesInX
        For j = 1 To i - 1
            p(i, j) = (p(i, j) + p(j, i)) / (2 * numberOfSamplesInX)
            p(j, i) = p(i, j)
        Next j
    Next i
    ''Sample Initial Solution Y
    ReDim y(1 To numberOfSamplesInX, 1 To 2)
    For i = 1 To numberOfSamplesInX
        For j = 1 To 2
            y(i, j) = Rnd()
        Next j
    Next i
    '''
    'for t=1 to T do
    'compute low-dimensional affinities qij
    'qij = (1+||yi-yj||^2)^-1) / Sum((1+||yk-yl||^2)^-1)
    'Compute gradient dCdY
    'dCdY=4*Sum((pij-qij)*(yi-yj)*(1+||yi-yj||^2))^-1
    'Set y(t)=y(t-1) + n dCdy + a(t) * (y(t-1)-y(t-2))
    'end
    '''
    ReDim aux(1 To numberOfSamplesInX, 1 To numberOfSamplesInX, 1 To 2)
    ReDim dCdYi(1 To numberOfSamplesInX, 1 To 2)
    ReDim q(1 To numberOfSamplesInX, 1 To numberOfSamplesInX)
    For iter = 1 To NumberOfIterations
        For i = 2 To numberOfSamplesInX
            For j = 1 To i - 1
                For n = 1 To 2
                    q(i, j) = q(i, j) + (y(i, n) - y(j, n)) ^ 2
                    q(j, i) = q(j, i) + (y(j, n) - y(i, n)) ^ 2
                Next n
            Next j
        Next i
        For i = 2 To numberOfSamplesInX
            For j = 1 To i - 1
                q(i, j) = (1 + q(i, j)) ^ -1
                q(j, i) = (1 + q(j, i)) ^ -1
                For n = 1 To 2
                    aux(i, j, n) = q(i, j)
                    aux(j, i, n) = q(j, i)
                Next n
                Sumq = Sumq + q(i, j) + q(j, i)
            Next j
        Next i
        For i = 2 To numberOfSamplesInX
            For j = 1 To i - 1
                q(i, j) = q(i, j) / Sumq
                q(j, i) = q(j, i) / Sumq
            Next j
        Next i
        ''Gradient Calculation (Check if keeping this array in the memory is avoidable)
        For i = 2 To numberOfSamplesInX
            For j = 1 To i - 1
                For n = 1 To 2
                dCdYi(i, n) = dCdYi(i, n) + aux(i, j, n) * (y(i, n) - y(j, n)) * (p(i, j) - q(i, j))
                dCdYi(j, n) = dCdYi(j, n) + aux(j, i, n) * (y(j, n) - y(i, n)) * (p(j, i) - q(j, i))
                Next n
            Next j
        Next i
        ''y adjustment
        For i = 1 To numberOfSamplesInX
            For n = 1 To 2
                y(i, n) = y(i, n) - 80 * dCdYi(i, n)
            Next n
        Next i
    Next iter
    TSNE = y
End Function
Private Function getMeThePairWiseAffinities(x() As Variant, numberOfSamplesInX As Long, numberOfDimentions As Long, minusTwoSigmaSquared() As Variant)
    Dim i As Long 'These are only going to help in the for loops
    Dim j As Long 'These are only going to help in the for loops
    Dim n As Long 'These are only going to help in the for loops
    Dim p() As Variant 'pj|i
    Dim sumOfPairWiseAffinities() As Variant
    ReDim sumOfPairWiseAffinities(1 To numberOfSamplesInX)
    ReDim p(1 To numberOfSamplesInX, 1 To numberOfSamplesInX)
'    ''Llenar de 0s la diagonal.
'    ''Esto Tranquilamente lo puedo sacar a un lugar menos iterado
'    For i = 1 To numberOfSamplesInX
'        p(i, i) = 0
'    Next i
    ''pair wise affinities non normalized
    For i = 2 To numberOfSamplesInX
        For j = 1 To i - 1
            For n = 1 To numberOfDimentions
                p(j, i) = p(j, i) + (x(i, n) - x(j, n)) ^ 2
                p(i, j) = p(i, j) + (x(j, n) - x(i, n)) ^ 2
            Next n
        Next j
    Next i
    '' get the sum of pair wise affinities and the non normilized pair wise affinities
    For i = 2 To numberOfSamplesInX
        For j = 1 To i - 1
            p(j, i) = Exp(-(p(j, i)) / minusTwoSigmaSquared(j))
            p(i, j) = Exp(-(p(i, j)) / minusTwoSigmaSquared(i))
        Next j
    Next i
    For i = 2 To numberOfSamplesInX
        For j = 1 To i - 1
            sumOfPairWiseAffinities(i) = sumOfPairWiseAffinities(i) + p(i, j)
            sumOfPairWiseAffinities(j) = sumOfPairWiseAffinities(j) + p(j, i)
        Next j
    Next i
    '' get the normilized pair wise affinities (added a small value to ensure a real number)
    For i = 2 To numberOfSamplesInX
        For j = 1 To i - 1
            p(j, i) = p(j, i) / (sumOfPairWiseAffinities(j) + 0.0001)
            p(i, j) = p(i, j) / (sumOfPairWiseAffinities(i) + 0.0001)
        Next j
    Next i
    getMeThePairWiseAffinities = p
End Function
Private Function SearchMeForFixedPerpexity(x() As Variant, numberOfSamplesInX As Long, numberOfDimentions As Long, DesiredPerplexity As Double) As Variant
    Dim i As Long 'These are only going to help in the for loops
    Dim iter As Long 'These are only going to help in the for loops
    Dim top1() As Variant
    ReDim top1(1 To numberOfSamplesInX)
    Dim top2() As Variant
    ReDim top2(1 To numberOfSamplesInX)
    Dim middle1() As Variant
    ReDim middle1(1 To numberOfSamplesInX)
    Dim middle2() As Variant
    ReDim middle2(1 To numberOfSamplesInX)
    Dim bottom1() As Variant
    ReDim bottom1(1 To numberOfSamplesInX)
    Dim bottom2() As Variant
    ReDim bottom2(1 To numberOfSamplesInX)
    Dim minusTwoSigmaSquared() As Variant
    ReDim minusTwoSigmaSquared(1 To numberOfSamplesInX)
    Dim p() As Variant 'pj|i
    For i = 1 To numberOfSamplesInX
        top1(i) = 1000
        bottom1(i) = 0.05
        middle1(i) = (top1(i) + bottom1(i)) / 2
    Next i
        p = getMeThePairWiseAffinities(x, numberOfSamplesInX, numberOfDimentions, top1)
        top2 = GetMeThePerplexity(p, numberOfSamplesInX)
        p = getMeThePairWiseAffinities(x, numberOfSamplesInX, numberOfDimentions, bottom1)
        bottom2 = GetMeThePerplexity(p, numberOfSamplesInX)
        p = getMeThePairWiseAffinities(x, numberOfSamplesInX, numberOfDimentions, middle1)
        middle2 = GetMeThePerplexity(p, numberOfSamplesInX)
    For iter = 1 To 1000
        ''Decision Maker (you can do better than this)
        For i = 1 To numberOfSamplesInX
            If Abs(middle2(i) - DesiredPerplexity) < 0.1 Then
                minusTwoSigmaSquared(i) = middle1(i)
            ElseIf middle2(i) > DesiredPerplexity Then
                top1(i) = middle1(i)
                top2(i) = middle2(i)
                middle1(i) = (top1(i) + bottom1(i)) / 2
            Else
                bottom1(i) = middle1(i)
                bottom2(i) = middle2(i)
                middle1(i) = (top1(i) + bottom1(i)) / 2
            End If
        Next i
        p = getMeThePairWiseAffinities(x, numberOfSamplesInX, numberOfDimentions, middle1)
        middle2 = GetMeThePerplexity(p, numberOfSamplesInX)
    Next iter
    SearchMeForFixedPerpexity = minusTwoSigmaSquared
End Function
Private Function GetMeThePerplexity(p() As Variant, numberOfSamplesInX As Long) As Variant
Dim Perplexities() As Variant
ReDim Perplexities(1 To numberOfSamplesInX)
Dim i As Long 'These are only going to help in the for loops
Dim j As Long 'These are only going to help in the for loops
On Error Resume Next
For i = 2 To numberOfSamplesInX
    For j = 1 To i - 1
        Perplexities(i) = Perplexities(i) + p(i, j) * Log(p(i, j)) * 1.44269504088896
        Perplexities(j) = Perplexities(j) + p(j, i) * Log(p(j, i)) * 1.44269504088896
    Next j
Next i
On Error GoTo 0
For i = 1 To numberOfSamplesInX
    Perplexities(i) = 2 ^ (-Perplexities(i))
Next i
GetMeThePerplexity = Perplexities
End Function
