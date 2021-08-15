function PerformPCA(A, LowDimension, LowerDimensionalApproximation){
    //Decide the size of the lower dimensional approximation
    //minimum size of the variance matrix will be 30 x 30 and
    //cannot be smaller than the requested size plus two.
    let mOriginal = A[0].length;
    if (mOriginal > LowerDimensionalApproximation){
        if(mOriginal - LowDimension > 2){
        }else{
            LowerDimensionalApproximation = LowDimension + 2;
        }
        A = PreReduceDimensionality(A, LowerDimensionalApproximation);
    }
    //Data Normalization
    let mNew = A[0].length;
    let p = A.length;
    let Average = 0;
    let StandardDeviation = 0;
    for(let j = 0; j < mNew; j++){
        Average = 0;
        for(let i = 0; i < p; i++){
            Average = Average + A[i][j];
        }
        Average = Average / (p + 1);
        StandardDeviation = 0;
        for(let i = 0; i < p; i++){
            A[i][j] = A[i][j] - Average;
            StandardDeviation = StandardDeviation + Math.pow(A[i][j], 2);
        }
        StandardDeviation = Math.sqrt(StandardDeviation / p);
        for(let i = 0; i < p; i++){
            A[i][j] = A[i][j] / StandardDeviation;
        }
    }
    //Covariance Matrix
    let C = zeros(mNew - 1, mNew - 1);
    for(let i = 0; i < mNew; i++){
        for(let j = 0; j < mNew; j ++){
            for(let k = 0; k < p; k++){
                C[i][j] = C[i][j] + A[k][i] * A[k][j];
            }
            C[i][j] = C[i][j] / p;
        }
    }
    //PCA
    let R = createIdentity(mNew, mNew);
    for(let iter = 0; iter <= 10; iter++){
        C = fmMult(R, C);
        for(let j = 0; j < mNew; j++){
            R[j][j] = 0;
            for(let i = 0; i < mNew; i++){
                R[j][j] = R[j][j] + Math.pow(C[i][j], 2);
            }
            R[j][j] = Math.sqrt(R[j][j]);
            for(let i = 0; i < mNew; i++){
                C[i][j] = C[i][j] / R[j][j];
            }
            for(let k = (j + 1); k < mNew; k++){
                R[j][k] = 0;
                for(let i = 0; i < mNew; i++){
                    R[j][k] = R[j][k] + C[i][j] * C[i][k];
                }
                for(let i = 0; i < mNew; i++){
                    C[i][k] = C[i][k] - C[i][j] * R[j][k];
                }
            }
        }
    }
    R = createIdentity(mNew, mNew);
    R = fmMult(R, C); //Now R is E
    //Perform de Dimensionality Reduction
    C = zeros(p - 1, LowDimension - 1);
    for (let i = 0; i < p; i++){
        for(let j = 0; j < mNew; j++){
            for(let k = 0; k <= LowDimension - 1; k++){
                C[i][k] = C[i][k] + A[i][j] * R[j][k];
            }
        }
    }
    return C;
}
function createIdentity(mRows, nCols){
    let A = zeros(mRows - 1, nCols - 1);
    for(i = 0; i <= mRows - 1; i++){
        for(j = 0;j <= nCols - 1; j++){
            if(i == j){
                A[i][j] = 1;
            }else{
                A[i][j] = 0;
            }
        }
    }
    return A;
}
function PreReduceDimensionality(A, LowerDimensionalApproximation){
    let INVNORM = [-3.09023230616781,-2.87816173909548,-2.74778138544499,-2.6520698079022,-2.5758293035489,-2.51214432793046,-2.45726339020544,-2.40891554581546,-2.36561812686429,-2.32634787404084,-2.29036787785527,-2.25712924448622,-2.22621176931718,-2.19728637664105,-2.17009037758456,-2.14441062091184,-2.12007168974215,-2.09692742916434,-2.07485473439331,-2.05374891063182,-2.03352014925305,-2.01409081201814,-1.99539331016782,-1.97736842818195,-1.95996398454005,-1.94313375110507,-1.92683657326391,-1.91103564754912,-1.89569792399184,-1.88079360815125,-1.86629574345811,-1.85217985876905,-1.83842366924778,-1.8250068211464,-1.8119106729526,-1.79911810683797,-1.78661336549347,-1.77438191034496,-1.76241029786239,-1.75068607125217,-1.73919766528525,-1.72793432238842,-1.71688601843104,-1.70604339688896,-1.69539771027214,-1.68494076787191,-1.67466488902433,-1.66456286120272,-1.65462790235108,-1.64485362695147,-1.63523401538865,-1.62576338623323,-1.61643637111502,-1.60724789190022,-1.59819313992282,-1.58926755705139,-1.58046681839936,-1.57178681650986,-1.56322364686628,-1.55477359459685,-1.54643312225675,-1.53819885858406,-1.53006758813783,-1.52203624173586,-1.51410188761928,-1.50626172327824,-1.49851306787998,-1.49085335524666,-1.48328012733562,-1.47579102817917,-1.46838379824566,-1.46105626918691,-1.45380635894057,-1.44663206715898,-1.43953147093846,-1.43250272082581,-1.42554403708045,-1.41865370617274,-1.41183007750081,-1.40507156030964,-1.3983766207975,-1.39174377939633,-1.38517160821344,-1.37865872862328,-1.37220380899873,-1.36580556257227,-1.35946274541826,-1.353174154548,-1.34693862611028,-1.34075503369022,-1.33462228670019,-1.32853932885681,-1.32250513673844,-1.31651871841826,-1.31057911216813,-1.30468538522879,-1.29883663264251,-1.29303197614424,-1.28727056310794,-1.2815515655446,-1.27587417914913,-1.27023762239315,-1.26464113566108,-1.25908398042707,-1.25356543847045,-1.24808481112755,-1.24264141857788,-1.23723459916283,-1.23186370873498,-1.22652812003661,-1.22122722210557,-1.21596041970732,-1.2107271327916,-1.20552679597252,-1.20035885803086,-1.19522278143743,-1.19011804189642,-1.18504412790781,-1.18000054034773,-1.17498679206609,-1.17000240750048,-1.1650469223056,-1.16011988299752,-1.15522084661195,-1.15034938037601,-1.1455050613927,-1.14068747633762,-1.13589622116731,-1.13113090083863,-1.1263911290388,-1.12167652792549,-1.11698672787661,-1.11232136724931,-1.1076800921478,-1.1030625561996,-1.09846842033986,-1.09389735260344,-1.08934902792428,-1.08482312794196,-1.08031934081496,-1.07583736104043,-1.07137688928021,-1.06693763219277,-1.06251930227087,-1.05812161768478,-1.05374430213067,-1.04938708468411,-1.04504969965839,-1.04073188646754,-1.03643338949379,-1.03215395795931,-1.02789334580214,-1.02365131155609,-1.01942761823437,-1.01522203321703,-1.01103432814181,-1.00686427879852,-1.00271166502655,-0.998576270615657,-0.99445788320975,-0.990356294213574,-0.986271298702237,-0.982202695333469,-0.97815028626247,-0.97411387705931,-0.970093276628738,-0.966088297132373,-0.962098753913141,-0.958124465421901,-0.954165253146195,-0.950220941541016,-0.946291357961576,-0.942376332597951,-0.938475698411567,-0.934589291073479,-0.930716948904339,-0.926858512816045,-0.923013826254981,-0.91918273514682,-0.915365087842815,-0.911560735067541,-0.907769529868055,-0.903991327564401,-0.900225985701434,-0.896473364001916,-0.892733324320855,-0.889005730601025,-0.885290448829642,-0.881587346996175,-0.877896295051228,-0.874217164866483,-0.870549830195654,-0.866894166636438,-0.863250051593421,-0.859617364241913,-0.855995985492682,-0.852385797957574,-0.848786685915967,-0.845198535282051,-0.841621233572915,-0.838054669877406,-0.834498734825741,-0.830953320559838,-0.827418320704383,-0.823893630338558,-0.820379145968462,-0.816874765500164,-0.813380388213404,-0.809895914735898,-0.806421247018241,-0.802956288309394,-0.799500943132736,-0.796055117262663,-0.792618717701712,-0.789191652658222,-0.785773831524484,-0.782365164855387,-0.778965564347546,-0.775574942818884,-0.772193214188685,-0.768820293458062,-0.765456096690878,-0.762100540995067,-0.758753544504371,-0.755415026360469,-0.752084906695491,-0.748763106614909,-0.74544954818079,-0.74214415439541,-0.738846849185214,-0.735557557385111,-0.7322762047231,-0.729002717805218,-0.725737024100805,-0.722479051928063,-0.719228730439924,-0.715985989610205,-0.712750760220043,-0.709522973844608,-0.706302562840087,-0.703089460330928,-0.699883600197341,-0.696684917063051,-0.693493346283289,-0.690308823933034,-0.68713128679547,-0.683960672350682,-0.680796918764575,-0.677639964877996,-0.674489750196082,-0.671346214877805,-0.668209299725723,-0.665078946175923,-0.661955096288162,-0.658837692736188,-0.655726678798254,-0.652621998347801,-0.649523595844325,-0.646431416324408,-0.643345405392917,-0.640265509214374,-0.637191674504475,-0.63412384852177,-0.631061979059499,-0.62800601443757,-0.624955903494688,-0.621911595580624,-0.618873040548629,-0.615840188747972,-0.612812991016627,-0.60979139867408,-0.606775363514265,-0.60376483779863,-0.600759774249319,-0.597760126042478,-0.594765846801678,-0.591776890591446,-0.58879321191092,-0.585814765687599,-0.582841507271216,-0.579873392427705,-0.576910377333272,-0.573952418568573,-0.570999473112987,-0.568051498338983,-0.565108452006584,-0.562170292257926,-0.559236977611907,-0.556308466958918,-0.553384719555673,-0.550465695020113,-0.547551353326401,-0.544641654799999,-0.541736560112817,-0.53883603027845,-0.53594002664749,-0.533048510902909,-0.53016144505552,-0.527278791439508,-0.524400512708041,-0.521526571828932,-0.518656932080391,-0.515791557046828,-0.512930410614728,-0.510073456968595,-0.507220660586946,-0.504371986238382,-0.501527398977708,-0.498686864142122,-0.495850347347454,-0.493017814484465,-0.490189231715209,-0.487364565469441,-0.484543782441079,-0.48172684958473,-0.478913734112256,-0.476104403489395,-0.473298825432437,-0.470496967904941,-0.467698799114508,-0.464904287509594,-0.462113401776377,-0.459326110835663,-0.456542383839841,-0.45376219016988,-0.450985499432371,-0.448212281456609,-0.44544250629172,-0.442676144203821,-0.439913165673234,-0.437153541391722,-0.434397242259781,-0.431644239383956,-0.428894504074202,-0.426148007841278,-0.423404722394183,-0.420664619637616,-0.417927671669482,-0.415193850778427,-0.412463129441405,-0.409735480321281,-0.407010876264466,-0.404289290298579,-0.401570695630149,-0.398855065642337,-0.396142373892698,-0.393432594110967,-0.39072570019687,-0.388021666217977,-0.385320466407568,-0.382622075162534,-0.379926467041307,-0.377233616761812,-0.374543499199443,-0.371856089385075,-0.36917136250309,-0.366489293889434,-0.363809859029696,-0.361133033557212,-0.358458793251194,-0.355787114034875,-0.353117971973689,-0.350451343273461,-0.347787204278627,-0.345125531470472,-0.342466301465391,-0.339809491013167,-0.337155076995277,-0.334503036423212,-0.331853346436817,-0.329205984302651,-0.326560927412373,-0.323918153281133,-0.321277639545997,-0.318639363964375,-0.316003304412483,-0.313369438883806,-0.310737745487592,-0.308108202447355,-0.305480788099397,-0.302855480891349,-0.300232259380722,-0.29761110223348,-0.294991988222626,-0.292374896226804,-0.289759805228914,-0.287146694314745,-0.284535542671622,-0.281926329587061,-0.279319034447454,-0.276713636736747,-0.274110116035147,-0.271508452017839,-0.26890862445371,-0.266310613204095,-0.26371439822153,-0.261119959548518,-0.25852727731631,-0.255936331743693,-0.2533471031358,-0.250759571882916,-0.248173718459313,-0.245589523422081,-0.243006967409982,-0.240426031142308,-0.237846695417749,-0.23526894111328,-0.232692749183045,-0.230118100657266,-0.22754497664115,-0.224973358313812,-0.222403226927206,-0.219834563805069,-0.217267350341863,-0.214701568001745,-0.212137198317524,-0.209574222889649,-0.207012623385187,-0.204452381536821,-0.201893479141851,-0.199335898061207,-0.196779620218467,-0.194224627598883,-0.19167090224842,-0.189118426272793,-0.186567181836519,-0.18401715116198,-0.181468316528477,-0.178920660271312,-0.176374164780861,-0.173828812501662,-0.171284585931507,-0.168741467620538,-0.166199440170359,-0.163658486233141,-0.161118588510745,-0.158579729753843,-0.15604189276105,-0.153505060378057,-0.150969215496777,-0.14843434105449,-0.145900420032994,-0.143367435457767,-0.140835370397127,-0.138304207961404,-0.135773931302112,-0.133244523611124,-0.130715968119863,-0.128188248098486,-0.125661346855074,-0.123135247734837,-0.120609934119307,-0.118085389425553,-0.115561597105383,-0.113038540644565,-0.110516203562042,-0.107994569409154,-0.105473621768868,-0.102953344255004,-0.10043372051147,-0.0979147342114993,-0.0953963690568919,-0.0928786087772564,-0.0903614371292587,-0.0878448378958717,-0.085328794885629,-0.0828132919318812,-0.0802983128920549,-0.0777838416469152,-0.0752698620998299,-0.0727563581760375,-0.0702433138219167,-0.0677307130042592,-0.0652185397095437,-0.0627067779432138,-0.0601954117289566,-0.0576844251079842,-0.0551738021383168,-0.0526635268940684,-0.0501535834647337,-0.0476439559544766,-0.0451346284814213,-0.0426255851769444,-0.0401168101849681,-0.0376082876612559,-0.0351000017727088,-0.0325919366966631,-0.0300840766201891,-0.0275764057393917,-0.0250689082587111,-0.0225615683902247,-0.0200543703529506,-0.0175472983721508,-0.0150403366786357,-0.0125334695080693,-0.0100266811002748,-0.00751995569854052,-0.00501327754892666,-0.00250663089957177,0,0.00250663089957177,0.00501327754892666,0.00751995569854052,0.0100266811002748,0.0125334695080693,0.0150403366786357,0.0175472983721508,0.0200543703529506,0.0225615683902247,0.0250689082587111,0.0275764057393917,0.0300840766201891,0.0325919366966631,0.0351000017727088,0.0376082876612559,0.0401168101849681,0.0426255851769444,0.0451346284814213,0.0476439559544766,0.0501535834647337,0.0526635268940684,0.0551738021383168,0.0576844251079842,0.0601954117289566,0.0627067779432138,0.0652185397095437,0.0677307130042592,0.0702433138219167,0.0727563581760375,0.0752698620998299,0.0777838416469152,0.0802983128920551,0.0828132919318813,0.0853287948856292,0.0878448378958718,0.0903614371292588,0.0928786087772565,0.095396369056892,0.0979147342114995,0.10043372051147,0.102953344255004,0.105473621768868,0.107994569409154,0.110516203562042,0.113038540644565,0.115561597105383,0.118085389425553,0.120609934119307,0.123135247734837,0.125661346855074,0.128188248098486,0.130715968119863,0.133244523611124,0.135773931302112,0.138304207961405,0.140835370397127,0.143367435457767,0.145900420032994,0.14843434105449,0.150969215496777,0.153505060378057,0.15604189276105,0.158579729753843,0.161118588510745,0.163658486233141,0.166199440170359,0.168741467620538,0.171284585931507,0.173828812501662,0.176374164780861,0.178920660271312,0.181468316528477,0.184017151161979,0.186567181836519,0.189118426272792,0.19167090224842,0.194224627598883,0.196779620218467,0.199335898061207,0.201893479141851,0.204452381536821,0.207012623385187,0.209574222889649,0.212137198317524,0.214701568001744,0.217267350341863,0.219834563805069,0.222403226927206,0.224973358313811,0.227544976641149,0.230118100657266,0.232692749183045,0.23526894111328,0.237846695417749,0.240426031142308,0.243006967409982,0.245589523422081,0.248173718459313,0.250759571882916,0.2533471031358,0.255936331743693,0.25852727731631,0.261119959548518,0.26371439822153,0.266310613204095,0.26890862445371,0.271508452017839,0.274110116035147,0.276713636736747,0.279319034447454,0.281926329587061,0.284535542671622,0.287146694314745,0.289759805228914,0.292374896226804,0.294991988222626,0.29761110223348,0.300232259380722,0.302855480891349,0.305480788099397,0.308108202447355,0.310737745487592,0.313369438883806,0.316003304412483,0.318639363964375,0.321277639545997,0.323918153281133,0.326560927412373,0.329205984302651,0.331853346436817,0.334503036423212,0.337155076995277,0.339809491013167,0.342466301465391,0.345125531470472,0.347787204278627,0.350451343273461,0.353117971973689,0.355787114034875,0.358458793251194,0.361133033557212,0.363809859029696,0.366489293889434,0.36917136250309,0.371856089385075,0.374543499199443,0.377233616761812,0.379926467041307,0.382622075162534,0.385320466407568,0.388021666217977,0.39072570019687,0.393432594110967,0.396142373892698,0.398855065642337,0.401570695630149,0.404289290298579,0.407010876264466,0.409735480321281,0.412463129441405,0.415193850778427,0.417927671669482,0.420664619637616,0.423404722394183,0.426148007841278,0.428894504074202,0.431644239383956,0.434397242259781,0.437153541391722,0.439913165673234,0.442676144203822,0.44544250629172,0.448212281456609,0.450985499432371,0.45376219016988,0.456542383839841,0.459326110835663,0.462113401776377,0.464904287509595,0.467698799114508,0.470496967904942,0.473298825432437,0.476104403489395,0.478913734112256,0.48172684958473,0.484543782441079,0.487364565469441,0.490189231715209,0.493017814484465,0.495850347347453,0.498686864142122,0.501527398977708,0.504371986238381,0.507220660586946,0.510073456968595,0.512930410614728,0.515791557046828,0.518656932080391,0.521526571828932,0.524400512708041,0.527278791439508,0.530161445055519,0.533048510902909,0.53594002664749,0.53883603027845,0.541736560112817,0.544641654799999,0.547551353326401,0.550465695020113,0.553384719555673,0.556308466958918,0.559236977611907,0.562170292257926,0.565108452006584,0.568051498338983,0.570999473112987,0.573952418568573,0.576910377333271,0.579873392427705,0.582841507271216,0.585814765687599,0.58879321191092,0.591776890591446,0.594765846801678,0.597760126042478,0.600759774249319,0.60376483779863,0.606775363514265,0.60979139867408,0.612812991016627,0.615840188747972,0.618873040548629,0.621911595580624,0.624955903494688,0.62800601443757,0.631061979059499,0.63412384852177,0.637191674504475,0.640265509214374,0.643345405392917,0.646431416324408,0.649523595844325,0.652621998347801,0.655726678798254,0.658837692736188,0.661955096288162,0.665078946175923,0.668209299725723,0.671346214877805,0.674489750196082,0.677639964877996,0.680796918764575,0.683960672350682,0.68713128679547,0.690308823933034,0.693493346283289,0.696684917063051,0.699883600197341,0.703089460330928,0.706302562840087,0.709522973844608,0.712750760220043,0.715985989610205,0.719228730439924,0.722479051928063,0.725737024100805,0.729002717805218,0.7322762047231,0.735557557385111,0.738846849185214,0.74214415439541,0.74544954818079,0.748763106614909,0.752084906695491,0.755415026360469,0.758753544504371,0.762100540995067,0.765456096690878,0.768820293458062,0.772193214188685,0.775574942818884,0.778965564347546,0.782365164855387,0.785773831524484,0.789191652658222,0.792618717701712,0.796055117262663,0.799500943132736,0.802956288309394,0.806421247018241,0.809895914735898,0.813380388213404,0.816874765500164,0.820379145968462,0.823893630338558,0.827418320704383,0.830953320559838,0.834498734825741,0.838054669877407,0.841621233572915,0.84519853528205,0.848786685915967,0.852385797957575,0.855995985492682,0.859617364241911,0.863250051593421,0.866894166636437,0.870549830195654,0.874217164866484,0.877896295051229,0.881587346996174,0.885290448829642,0.889005730601025,0.892733324320857,0.896473364001916,0.900225985701434,0.903991327564402,0.907769529868055,0.911560735067539,0.915365087842813,0.919182735146819,0.923013826254979,0.926858512816042,0.930716948904339,0.93458929107348,0.938475698411567,0.94237633259795,0.946291357961576,0.950220941541016,0.954165253146195,0.958124465421901,0.962098753913141,0.966088297132373,0.970093276628738,0.97411387705931,0.97815028626247,0.982202695333469,0.986271298702237,0.990356294213574,0.99445788320975,0.998576270615657,1.00271166502655,1.00686427879852,1.01103432814181,1.01522203321703,1.01942761823437,1.02365131155609,1.02789334580214,1.03215395795931,1.03643338949379,1.04073188646754,1.04504969965839,1.04938708468411,1.05374430213067,1.05812161768478,1.06251930227087,1.06693763219277,1.07137688928021,1.07583736104043,1.08031934081496,1.08482312794196,1.08934902792428,1.09389735260344,1.09846842033986,1.1030625561996,1.1076800921478,1.11232136724931,1.11698672787661,1.12167652792549,1.1263911290388,1.13113090083863,1.13589622116731,1.14068747633762,1.1455050613927,1.15034938037601,1.15522084661195,1.16011988299752,1.1650469223056,1.17000240750048,1.17498679206609,1.18000054034773,1.18504412790781,1.19011804189642,1.19522278143743,1.20035885803086,1.20552679597252,1.2107271327916,1.21596041970732,1.22122722210557,1.22652812003661,1.23186370873498,1.23723459916283,1.24264141857788,1.24808481112755,1.25356543847045,1.25908398042707,1.26464113566108,1.27023762239315,1.27587417914913,1.2815515655446,1.28727056310794,1.29303197614424,1.29883663264251,1.30468538522879,1.31057911216813,1.31651871841826,1.32250513673844,1.32853932885681,1.33462228670019,1.34075503369022,1.34693862611028,1.353174154548,1.35946274541826,1.36580556257227,1.37220380899873,1.37865872862328,1.38517160821344,1.39174377939633,1.3983766207975,1.40507156030963,1.41183007750081,1.41865370617274,1.42554403708045,1.43250272082581,1.43953147093846,1.44663206715898,1.45380635894058,1.46105626918691,1.46838379824566,1.47579102817917,1.48328012733562,1.49085335524666,1.49851306787998,1.50626172327824,1.51410188761928,1.52203624173586,1.53006758813783,1.53819885858406,1.54643312225675,1.55477359459685,1.56322364686628,1.57178681650986,1.58046681839936,1.58926755705139,1.59819313992282,1.60724789190022,1.61643637111502,1.62576338623323,1.63523401538865,1.64485362695147,1.65462790235108,1.66456286120272,1.67466488902432,1.68494076787191,1.69539771027214,1.70604339688896,1.71688601843104,1.72793432238842,1.73919766528525,1.75068607125217,1.76241029786239,1.77438191034496,1.78661336549347,1.79911810683797,1.8119106729526,1.8250068211464,1.83842366924778,1.85217985876905,1.86629574345811,1.88079360815125,1.89569792399184,1.91103564754912,1.92683657326391,1.94313375110507,1.95996398454005,1.97736842818195,1.99539331016782,2.01409081201814,2.03352014925305,2.05374891063182,2.07485473439331,2.09692742916434,2.12007168974215,2.14441062091184,2.17009037758456,2.19728637664105,2.22621176931717,2.25712924448622,2.29036787785527,2.32634787404084,2.36561812686429,2.40891554581546,2.45726339020544,2.51214432793046,2.5758293035489,2.6520698079022,2.74778138544499,2.87816173909548,3.09023230616781];
    let m = A.length;
    let Q = Array(m);
    for (let i = 0; i < m; ++i) {
        Q[i] = Array(LowerDimensionalApproximation);
        for (let j = 0; j < LowerDimensionalApproximation; j ++){
            Q[i][j]=INVNORM[Math.floor(Math.random()*999,0)];
        }
    }
    return fmMult(A, Q);
}
function fmMult(A, B){
    let m = A.length;
    let n = B[0].length;
    let p = A[0].length;
    let C = zeros(m - 1,n - 1);
    for(i = 0; i < m; i++){
        for(j = 0; j < n; j++){
            for(k = 0; k < p; k++){
                C[i][j] = C[i][j] + A[i][k] * B[k][j];
            }
        }
    }
    return C;
}
