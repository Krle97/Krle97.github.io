const observedSymptomsElement = document.getElementById("o_symptoms");
const allSymptomsElement = document.getElementById("a_symptoms");
const commonCausersElement = document.getElementById("common_causers");

var database;

function EventListeners()
{
    allSymptomsElement.addEventListener('change', EventCallback);
}

function EventCallback()
{
    var selectedSymptoms = GetSelectValues(allSymptomsElement);
    // PRINT SYMPTOMS
    PrintObservedSymptoms(selectedSymptoms);
    // FIND ALL CAUSERS
    var allCausers = findAllCausers(selectedSymptoms);
    // FIND COMMON CAUSERS
    var commonCausers = findCommonCausers(allCausers);
    // PRINT ALL CAUSERS
    PrintCommonCausers(commonCausers);

}

function  GetSelectValues(select) 
{
    var result = [];
    var options = select && select.options;
    var opt;
  
    for (var i=0, iLen=options.length; i<iLen; i++) {
      opt = options[i];
  
      if (opt.selected) {
        result.push(opt.text);
      }
    }
    return result;
}

function PrintObservedSymptoms(selectedSymptoms)
{
    var result = "";
    var number = 1;
    for (const symptom of selectedSymptoms)
    {   
        var temp = symptom;
        result = result.concat(number.toString(), ". ")
        result = result.concat(temp, "\n");
        number++;
    }
    observedSymptomsElement.value = result;
}

function PrintCommonCausers(dict)
{
    // Create items array
    var items = Object.keys(dict).map(function(key) {
        return [key, dict[key]];
    });

    // Sort the array based on the second element
    items.sort(function(first, second) {
    return second[1] - first[1];
    });

    var result = "";
    for (var item of items)
    {
        var temp = item[1].toString().concat(" : ",item[0]);
        result = result.concat(temp, "\n");
    }
    commonCausersElement.value = result;
}


function findAllCausers(symptoms) {
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

    return arrays;
}

function findCommonCausers(arrays)
{
    var unique_elements = new Map();
    for (var o_array of arrays)
    {
        for(var o_element of o_array)
        {
            if(!unique_elements.has(o_element))
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
    }
    return unique_elements;
}

async function populate(htmlElement) {
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
            
            htmlElement.add(opt, htmlElement.options[opt_value]);
            opt_value++;
        }
        temp_symptom = symptom.symptom
    }
}

function isMobileDevice()
{
    /* Storing user's device details in a variable*/
    let details = navigator.userAgent; 

    /* Creating a regular expression 
    containing some mobile devices keywords 
    to search it in details string*/
    let regexp = /android|iphone|kindle|ipad/i; 

    return regexp.test(details);
}

function loadProperCss()
{
    var cssPath = "mobile.css";
    if(isMobileDevice() == false)
    {
        cssPath = "desktop.css";
    }
    
    var fileref = document.createElement("link");
    
    fileref.setAttribute("rel", "stylesheet");
    fileref.setAttribute("type", "text/css");
    fileref.setAttribute("href", cssPath);
    
    document.getElementsByTagName("head")[0].appendChild(fileref);
}

function startUp()
{
    loadProperCss();
    populate(allSymptomsElement);
    EventListeners();
}
