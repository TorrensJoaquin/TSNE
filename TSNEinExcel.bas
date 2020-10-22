Option Explicit
Function TSNE(XasRange As Range, DesiredPerplexity As Double, numberOfIterations As Long, numberOfDimentionsInLowDimensionalSpace As Integer)
    Randomize
    Dim p() As Variant 'pj|i and later will be pji
    Dim i As Long 'These are only going to help in the for loops
    Dim j As Long 'These are only going to help in the for loops
    Dim n As Long 'These are only going to help in the for loops
    Dim x() As Variant
    Dim numberOfSamplesInX As Long
    Dim iter As Long
    Dim numberOfDimentions As Long
    Dim y() As Variant
    Dim oldy() As Variant
    '
    x = XasRange.Value2
    Set XasRange = Nothing
    '
    numberOfSamplesInX = UBound(x, 1)
    '
    numberOfDimentions = UBound(x, 2)
    'Compute Non Symetric Pair Wise Affinities [pj|i] with perplexity [Per]
    'pj|i=exp(-||xi-xj||^2/2Sigma^2)/Sum(exp(-||xi-xk||^2/2Sigma^2))
    'Perp(Pi)=2^H(Pi)
    'H(Pi)=-Sum(pj|i)*log2(pj|i)
    ReDim p(1 To numberOfSamplesInX, 1 To numberOfSamplesInX)
    p = SearchMeForFixedPerpexity(x, numberOfSamplesInX, numberOfDimentions, DesiredPerplexity)
    'Set pij= ( pj|i + pi|j ) / 2 * n
    ReDim y(1 To numberOfSamplesInX, 1 To numberOfDimentionsInLowDimensionalSpace)
    ReDim oldy(1 To numberOfSamplesInX, 1 To numberOfDimentionsInLowDimensionalSpace)
    For i = 2 To numberOfSamplesInX
        For j = 1 To i - 1
            p(i, j) = (p(i, j) + p(j, i)) / (2 * numberOfSamplesInX)
        Next j
        ''Sample Initial Solution Y
        For j = 1 To numberOfDimentionsInLowDimensionalSpace
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
    Call YUpload(p, y, oldy, numberOfSamplesInX, numberOfDimentionsInLowDimensionalSpace, numberOfIterations)
    TSNE = y
End Function
Private Function getMeThePairWiseAffinities1(x() As Variant, numberOfSamplesInX As Long, numberOfDimentions As Long)
    'This is the part of the code that is independant of minusTwoSigmaSquared.
    'I can play this part of the code only once during the sogma search
    Dim i As Long 'These are only going to help in the for loops
    Dim j As Long 'These are only going to help in the for loops
    Dim n As Long 'These are only going to help in the for loops
    Dim p() As Variant 'pj|i
    ReDim p(1 To numberOfSamplesInX, 1 To numberOfSamplesInX)
    For i = 2 To numberOfSamplesInX
        For j = 1 To i - 1
            For n = 1 To numberOfDimentions
                p(j, i) = p(j, i) + (x(i, n) - x(j, n)) ^ 2
                p(i, j) = p(i, j) + (x(j, n) - x(i, n)) ^ 2
            Next n
        Next j
    Next i
    getMeThePairWiseAffinities1 = p
End Function
Private Function getMeThePairWiseAffinities2(p() As Variant, numberOfSamplesInX As Long, numberOfDimentions As Long, minusTwoSigmaSquared() As Variant)
    '' get the sum of pair wise affinities and the non normilized pair wise affinities
    Dim i As Long 'These are only going to help in the for loops
    Dim j As Long 'These are only going to help in the for loops
    Dim sumOfPairWiseAffinities() As Variant
    ReDim sumOfPairWiseAffinities(1 To numberOfSamplesInX)
    For i = 2 To numberOfSamplesInX
        For j = 1 To i - 1
            p(j, i) = Exp((p(j, i)) / minusTwoSigmaSquared(j))
            p(i, j) = Exp((p(i, j)) / minusTwoSigmaSquared(i))
        Next j
    Next i
    For i = 2 To numberOfSamplesInX
        For j = 1 To i - 1
            sumOfPairWiseAffinities(i) = sumOfPairWiseAffinities(i) + p(i, j)
            sumOfPairWiseAffinities(j) = sumOfPairWiseAffinities(j) + p(j, i)
        Next j
    Next i
    '' get the normilized pair wise affinities
    For i = 2 To numberOfSamplesInX
        For j = 1 To i - 1
            p(j, i) = p(j, i) / sumOfPairWiseAffinities(j)
            p(i, j) = p(i, j) / sumOfPairWiseAffinities(i)
        Next j
    Next i
    getMeThePairWiseAffinities2 = p
End Function
Private Function SearchMeForFixedPerpexity(x() As Variant, numberOfSamplesInX As Long, numberOfDimentions As Long, DesiredPerplexity As Double) As Variant
    Dim minusTwoSigmaSquared() As Variant
    ReDim minusTwoSigmaSquared(1 To numberOfSamplesInX)
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
    Dim p() As Variant 'pj|i
    Dim aux() As Variant
    ReDim aux(1 To numberOfSamplesInX, 1 To numberOfSamplesInX)
    aux = getMeThePairWiseAffinities1(x, numberOfSamplesInX, numberOfDimentions)
    For i = 1 To numberOfSamplesInX
        top1(i) = -100000
        bottom1(i) = -0.001
        middle1(i) = (top1(i) + bottom1(i)) / 2
    Next i
        p = getMeThePairWiseAffinities2(aux, numberOfSamplesInX, numberOfDimentions, top1)
        top2 = GetMeThePerplexity(p, numberOfSamplesInX)
        p = getMeThePairWiseAffinities2(aux, numberOfSamplesInX, numberOfDimentions, bottom1)
        bottom2 = GetMeThePerplexity(p, numberOfSamplesInX)
        p = getMeThePairWiseAffinities2(aux, numberOfSamplesInX, numberOfDimentions, middle1)
        middle2 = GetMeThePerplexity(p, numberOfSamplesInX)
    For iter = 1 To 500
        ''Decision Maker (you can do better than this, see it later)
        For i = 1 To numberOfSamplesInX
            If Abs(middle2(i) - DesiredPerplexity) < 0.01 Or iter = 500 Then
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
        p = getMeThePairWiseAffinities1(x, numberOfSamplesInX, numberOfDimentions)
        p = getMeThePairWiseAffinities2(p, numberOfSamplesInX, numberOfDimentions, middle1)
        middle2 = GetMeThePerplexity(p, numberOfSamplesInX)
    Next iter
    SearchMeForFixedPerpexity = p
End Function
Private Function GetMeThePerplexity(p() As Variant, numberOfSamplesInX As Long) As Variant
Dim Perplexities() As Variant
ReDim Perplexities(1 To numberOfSamplesInX)
Dim i As Long 'These are only going to help in the for loops
Dim j As Long 'These are only going to help in the for loops
For i = 2 To numberOfSamplesInX
    For j = 1 To i - 1
        Perplexities(i) = Perplexities(i) + p(i, j) * Log(p(i, j) + 0.001)
        Perplexities(j) = Perplexities(j) + p(j, i) * Log(p(j, i) + 0.001)
    Next j
Next i
For i = 1 To numberOfSamplesInX
    Perplexities(i) = 2 ^ (-Perplexities(i) * 1.44269504088896) 'A correction cause i've used log 10
Next i
GetMeThePerplexity = Perplexities
End Function
Private Sub YUpload(p() As Variant, y() As Variant, oldy() As Variant, numberOfSamplesInX As Long, numberOfDimentionsInLowDimensionalSpace As Integer, numberOfIterations As Long)
    Dim aux() As Variant
    Dim i As Long
    Dim j As Long
    Dim iter As Long
    Dim n As Integer
    Dim q() As Variant 'qji
    ReDim q(1 To numberOfSamplesInX, 1 To numberOfSamplesInX)
    Dim Sumq As Double
    Dim dCdYi() As Variant
    ReDim dCdYi(1 To numberOfSamplesInX, 1 To numberOfDimentionsInLowDimensionalSpace)
    ''First Momentum
    For iter = 1 To 20
        For i = 2 To numberOfSamplesInX
            For j = 1 To i - 1
                For n = 1 To numberOfDimentionsInLowDimensionalSpace
                    q(i, j) = q(i, j) + (y(i, n) - y(j, n)) ^ 2
'                    q(j, i) = q(j, i) + (y(j, n) - y(i, n)) ^ 2
                Next n
            Next j
        Next i
        ReDim aux(1 To numberOfSamplesInX, 1 To numberOfSamplesInX, 1 To numberOfDimentionsInLowDimensionalSpace)
        For i = 2 To numberOfSamplesInX
            For j = 1 To i - 1
                q(i, j) = (1 + q(i, j)) ^ -1
'                q(j, i) = (1 + q(j, i)) ^ -1
                For n = 1 To numberOfDimentionsInLowDimensionalSpace
                    aux(i, j, n) = q(i, j)
                    aux(j, i, n) = q(i, j)
'                    aux(j, i, n) = q(j, i)
                Next n
                Sumq = Sumq + q(i, j) + q(i, j)
            Next j
        Next i
        For i = 2 To numberOfSamplesInX
            For j = 1 To i - 1
                q(i, j) = q(i, j) / Sumq
'                q(j, i) = q(j, i) / Sumq
            Next j
        Next i
        ''Gradient Calculation (Check if keeping this array in the memory is avoidable)
        For i = 2 To numberOfSamplesInX
            For j = 1 To i - 1
                For n = 1 To numberOfDimentionsInLowDimensionalSpace
                    dCdYi(i, n) = dCdYi(i, n) + aux(i, j, n) * (y(i, n) - y(j, n)) * (p(i, j) - q(i, j))
                    dCdYi(j, n) = dCdYi(j, n) + aux(j, i, n) * (y(j, n) - y(i, n)) * (p(i, j) - q(i, j))
                Next n
            Next j
        Next i
        ''y adjustment
        ReDim aux(1 To numberOfSamplesInX, 1 To numberOfDimentionsInLowDimensionalSpace)
        For i = 1 To numberOfSamplesInX
            For n = 1 To numberOfDimentionsInLowDimensionalSpace
                aux(i, n) = y(i, n)
                y(i, n) = y(i, n) - 100 * dCdYi(i, n) + 0.5 * (y(i, n) - oldy(i, n))
                oldy(i, n) = aux(i, n)
            Next n
        Next i
    Next iter
    '' Final Momentum
    For iter = 20 To numberOfIterations
        For i = 2 To numberOfSamplesInX
            For j = 1 To i - 1
                For n = 1 To numberOfDimentionsInLowDimensionalSpace
                    q(i, j) = q(i, j) + (y(i, n) - y(j, n)) ^ 2
                    q(j, i) = q(j, i) + (y(j, n) - y(i, n)) ^ 2
                Next n
            Next j
        Next i
        ReDim aux(1 To numberOfSamplesInX, 1 To numberOfSamplesInX, 1 To numberOfDimentionsInLowDimensionalSpace)
        For i = 2 To numberOfSamplesInX
            For j = 1 To i - 1
                q(i, j) = (1 + q(i, j)) ^ -1
                q(j, i) = (1 + q(j, i)) ^ -1
                For n = 1 To numberOfDimentionsInLowDimensionalSpace
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
                For n = 1 To numberOfDimentionsInLowDimensionalSpace
                    dCdYi(i, n) = dCdYi(i, n) + aux(i, j, n) * (y(i, n) - y(j, n)) * (p(i, j) - q(i, j))
                    dCdYi(j, n) = dCdYi(j, n) + aux(j, i, n) * (y(j, n) - y(i, n)) * (p(i, j) - q(j, i))
                Next n
            Next j
        Next i
        ''y adjustment
        ReDim aux(1 To numberOfSamplesInX, 1 To numberOfDimentionsInLowDimensionalSpace)
        For i = 1 To numberOfSamplesInX
            For n = 1 To numberOfDimentionsInLowDimensionalSpace
                aux(i, n) = y(i, n)
                y(i, n) = y(i, n) - 100 * dCdYi(i, n) + 0.8 * (y(i, n) - oldy(i, n))
                oldy(i, n) = aux(i, n)
            Next n
        Next i
    Next iter
End Sub
