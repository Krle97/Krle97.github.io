const left_list = document.getElementById("o_symptoms");
const rigth_list = document.getElementById("a_symptoms");
var common_list = document.getElementById("commons");

var database;

left_list.addEventListener('click', function(e){
    if(e.target != this){
        rigth_list.appendChild(e.target.cloneNode(true));
        e.target.remove();
        updateCausersList();
    }
})

rigth_list.addEventListener('click', function(e){
    if(e.target != this){
        left_list.appendChild(e.target.cloneNode(true));
        e.target.remove();
        updateCausersList();
    }
})

function updateCausersList()
{
    // RESET SELECT LIST
    removeOptions(common_list);
    // GET OBSERVED SYMPTOMS
    var symptoms = getOptionText(left_list);
    // FIND COMMON CAUSERS
    causers = findCommonElements(symptoms);
    // PRINT THEM
    printCausers(causers);

}

function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }

function getOptionText(select_list) 
{
    let selectElement = select_list;
    let optionNames = [...selectElement.options].map(o => o.text);
    return optionNames;
}

function findCommonElements(symptoms) {
    var arrays = [];
    var db_symptoms = database.symptoms;

    for (const symptom of symptoms)
    {
        var array = [];
        for (const db_symptom of db_symptoms)
        {
            if(db_symptom.symptom == symptom)
            {
                if(db_symptom.specific != "None")
                {
                    array.push(db_symptom.specific);
                }
                else
                {
                    array.push(db_symptom.causer)
                }
            }
        }
        arrays.push(array);
    }

    return element_comparer(arrays);
}

function element_comparer(arrays)
{
    var unique_elements = {}
    for (var o_array of arrays)
    {
        for(var o_element of o_array)
        {
            var o_element_match = 0;
            for (var i_array of arrays)
            {
                var new_array = true;
                for(var i_element of i_array)
                {
                    if(i_element == o_element)
                    {
                        if(new_array == true)
                        {
                            o_element_match++;
                            new_array = false;
                        }
                    }
                }
            }
            unique_elements[o_element] = o_element_match;
            o_element_match = 0;
        }
    }
    return unique_elements;
}

function printCausers(dict)
{
    opt_value = 1;

    // Create items array
    var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
    });

    // Sort the array based on the second element
    items.sort(function(first, second) {
    return second[1] - first[1];
    });

    for (var item of items)
    {
        const opt = document.createElement("option");
        opt.value = opt_value;
        opt.text = item[0].concat(" : ",item[1]);

        if(item[1] > 1)
        {
            common_list.add(opt, common_list.options[opt_value]);
            opt_value++;
        }
    }
}

async function populate() {
    const requestURL = "https://raw.githubusercontent.com/Krle97/Krle97.github.io/main/symptom_file.json";
    const request = new Request(requestURL);
  
    const response = await fetch(request);
    database = await response.json();

    const symptoms = database.symptoms;

    temp_symptom = "";
    opt_value = 1;
    for (const symptom of symptoms)
    {
        if(temp_symptom != symptom.symptom)
        {
            const opt = document.createElement("option");
            opt.value = opt_value;
            opt.text = symptom.symptom;
            
            rigth_list.add(opt, rigth_list.options[opt_value]);
            opt_value++;
        }
        temp_symptom = symptom.symptom
    }
}