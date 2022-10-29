
function earley(obj_grammar, word){
    let Arr = [];
    let num = 0;
    let Arr_2;
    Arr[0] = [["Л -> ~S", 0]];

    for(let i = 0; i < (word.length + 1); i++){
        let save = null;
        num = scan(Arr, i, obj_grammar, word, num);
        while(Arr[i] !== undefined && save !== Arr[i].length){
            save = Arr[i].length;
            complete(Arr, i, obj_grammar, word);
            predict(Arr, i, obj_grammar, word);
        }
    }

    Arr_2 = Arr[word.length];

    console.log(Arr)
    if(Arr_2 !== undefined){
        for(let check = 0; check < Arr_2.length; check++){
            if(Arr_2[check][0] === "Л -> S~"
                && Arr_2[check][1] === 0){
                return true
            }
        }
    }

    return false
}

function scan(Arr, i, obj_grammar, word, num){
    let non_term = [];
    let str = null;
    for(let key in obj_grammar){
        non_term.push(key);
    }
    let Arr_2 = Arr[i - 1]

    if(i === 0){
        return num
    }
    if(Arr_2 !== undefined){
        for(let j = 0; j < Arr_2.length; j++){
            let save;
            let Arr_3 = Arr_2[j];
            for(let z = 0; z < Arr_3[0].length; z++){

                if(Arr_3[0][z] === "~"
                    && Arr_3[0][z + 1] !== undefined
                    && !non_term.includes(Arr_3[0][z + 1])
                    && Arr_3[0][z + 1] === word[i - 1]){
                    save = Arr_3[0][z + 1];
                    str = Arr_3[0].slice(0, z) + save + "~" + Arr_3[0].slice(z+2, Arr_3[0].length);
                    if(Arr[i] === undefined){
                        Arr[i] = [[str, Arr_3[1]]]
                    }
                    else{
                        Arr[i].push([str, Arr_3[1]]);
                    }
                }
            }
        }
    }
    return num;
}

function complete(Arr, i){
    let Arr_2 = Arr[i];
    let Arr_3;
    let str;
    let save;

    if(Arr_2 !== undefined){
        for(let j = 0; j < Arr_2.length; j++){
            if(Arr_2[j][0][Arr_2[j][0].length-1] === "~"){
                Arr_3 = Arr[Arr_2[j][1]];
                for(let z = 0; z < Arr_3.length; z++){
                    for(let w = 0; w < Arr_3[z][0].length; w++){
                        let check_repeat = true
                        if(Arr_3[z][0][w] === "~" && Arr_3[z][0][w+1] === Arr_2[j][0][0]){
                            save = Arr_3[z][0][w + 1];
                            str = Arr_3[z][0].slice(0, w) + save + "~" + Arr_3[z][0].slice(w+2, Arr_3[z][0].length);
                            for(let check = 0; check < Arr[i].length; check++){
                                if(Arr[i][check][0] === str && Arr[i][check][1] === Arr_3[z][1]){
                                    check_repeat = false;
                                }
                            }
                            if(check_repeat) {
                                if(i === Arr_2[j][1]){
                                    Arr[i][z] = [str, Arr_3[z][1]]
                                }
                                else{
                                    Arr[i].push([str, Arr_3[z][1]]);
                                }
                            }

                        }
                    }
                }
            }
        }
    }
}

function del_eps(Arr, i, term, num){
    let Arr_2 = Arr[i];
    let str = null;
    let check_repeat = null;
    for(let j = 0; j < Arr_2.length; j++){
        for(let z = 0; z < Arr_2[j][0].length; z++){
            check_repeat = true
            if(Arr_2[j][0][z] === "~" && Arr_2[j][0][z + 1] === term){
                str = Arr_2[j][0].slice(0, z) + term + "~" + Arr_2[j][0].slice(z+2, Arr_2[j][0].length);
                for(let check = 0; check < Arr[i].length; check++){
                    if(Arr[i][check][0] === str && Arr[i][check][1] === num){
                        check_repeat = false;
                    }
                }
                if(check_repeat) {
                    Arr[i].push([str, num])
                }
                if(check_repeat) z = 0;
            }
        }
    }
}

function predict(Arr, i, obj_grammar){
    let Arr_2 = Arr[i];
    let non_term = [];
    let check_repeat = null;
    for(let key in obj_grammar){
        non_term.push(key);
    }
    if(Arr_2 !== undefined){
        for(let j = 0; j < Arr_2.length; j++){
            for(let z = 0; z < Arr_2[j][0].length; z++){
                check_repeat = true;
                if(Arr_2[j][0][z] !== undefined
                    && Arr_2[j][0][z] === "~"
                    && Arr_2[j][0][z+1] !== undefined
                    && non_term.includes(Arr_2[j][0][z+1])){
                    if(typeof(obj_grammar[Arr_2[j][0][z+1]]) === "string"){
                        if(obj_grammar[Arr_2[j][0][z+1]] === "") del_eps(Arr, i, Arr_2[j][0][z+1], Arr_2[j][1]);
                        for(let check = 0; check < Arr[i].length; check++){
                            if(Arr[i][check][0] === `${Arr_2[j][0][z+1]} -> ~${obj_grammar[Arr_2[j][0][z+1]]}`
                                && Arr[i][check][1] === i){
                                check_repeat = false;
                            }
                        }
                        if(check_repeat !== false) check_repeat = true;
                        if(check_repeat) {
                            Arr[i].push([`${Arr_2[j][0][z+1]} -> ~${obj_grammar[Arr_2[j][0][z+1]]}`, i])
                        }
                    }else{
                        for(let o = 0; o < obj_grammar[Arr_2[j][0][z+1]].length; o++){
                            if(obj_grammar[Arr_2[j][0][z+1]][o] === "") del_eps(Arr, i, Arr_2[j][0][z+1], Arr_2[j][1]);
                            check_repeat = true;
                            for(let check = 0; check < Arr[i].length; check++){
                                if(Arr[i][check][0] === `${Arr_2[j][0][z+1]} -> ~${obj_grammar[Arr_2[j][0][z+1]][o]}`
                                    && Arr[i][check][1] === i){
                                    check_repeat = false;
                                }
                            }
                            if(check_repeat !== false) check_repeat = true;
                            if(check_repeat) {
                                Arr[i].push([`${Arr_2[j][0][z+1]} -> ~${obj_grammar[Arr_2[j][0][z+1]][o]}`, i])
                            }
                        }
                    }
                }
            }
        }
    }
}

console.log(earley({"S":["(S)A", "[S]B", ""], "A":["[S]B", ""], "B":["(S)A", ""]}, "()"));
console.log(earley({"S":"a"}, " jnb"));
// console.log(earley({"S":["T+S", "T"], "T":["F*T", "F"], "F":["(S)", "a"]}, "(a+a)"));