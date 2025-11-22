document.addEventListener('DOMContentLoaded', function() {

    const fileInput = document.getElementById('fileInput');
    const fileContent = document.getElementById('fileContent');
    const lexiBtn = document.getElementById('lexicalbtn');
    const syntaxBtn = document.getElementById('syntaxbttn');
    const semanBtn = document.getElementById('semanticbtn');
    const output = document.getElementById('output');

    const validTypes = ["int", "float", "double", "boolean", "char", "String"];


    window.openFile = function() {
        const file = fileInput.files[0];
        console.log("Opening file:", file?.name);

        const reader = new FileReader();
        reader.onload = function(e) {
            fileContent.value = e.target.result;
            console.log("File content loaded:\n", e.target.result);

            lexiBtn.disabled = false;// only lexical button is open here
            syntaxBtn.disabled = true;
            semanBtn.disabled = true;

            output.textContent = "OUTPUT";
        };
        reader.readAsText(file);
    };

   
    window.eraseText = function() {
        
        fileContent.value = ''; 
        console.log("successfully erased");

        lexiBtn.disabled = true;
        syntaxBtn.disabled = true;
        semanBtn.disabled = true;

        output.textContent = "OUTPUT";
    };

   // LEXICAL PHASE LOGIC
    window.lexicalAnalyzer = function() {
        
        let tokens = fileContent.value.split(/\s+/);
        let tokenPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$|^[0-9]+(\.[0-9]+)?$|^"[^"]*"|'[^']'|=|;$/;

        console.log("Tokens found:", tokens);

        for (let t of tokens) {
            if (t.trim() === "") continue;

            console.log("Checking token:", t);
            let isValid = tokenPattern.test(t) || validTypes.includes(t);
            console.log(`Token "${t}" is valid? →`, isValid);

            if (!isValid) {
                output.textContent = "LEXICAL ERROR: Invalid token: " + t;
                console.error("LEXICAL ERROR: Invalid token: ", t);
                return;
            }
        }

        output.textContent = "LEXICAL ANALYSIS PASSED";
        console.log("Pasado mga bossing sa lexical GYAHAHA");


        syntaxBtn.disabled = false;
    };

   
    window.syntaxAnalyzer = function() {
            let lines = fileContent.value.split("\n");
// will update this, still learning how BNF works
         lines.forEach((line, i) => {
            console.log(`Line ${i+1}:`, line);
        });
        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === "") continue;

            console.log(`Checking syntax of line ${i+1}: "${line}"`);

            if (!line.endsWith(";")) {
                console.error(`SYNTAX ERROR: not ending in semicolon ${i+1}`);
                output.textContent = `SYNTAX ERROR (Line ${i+1}): not ending in semicolon`;
                return;
            }

            let words = line.replace(";", "").split(/\s+/);

            let type = words[0];
            let identifier = words[1];

            console.log(`Parsed type: "${type}", identifier: "${identifier}"`);

            if (!validTypes.includes(type)) {
                console.error(`SYNTAX ERROR: Invalid datatype "${type}" at line ${i+1}`);
                output.textContent = `SYNTAX ERROR (Line ${i+1}): Invalid data type "${type}"`;
                return;
            }

            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) {
                console.error(`SYNTAX ERROR: Invalid identifier "${identifier}" at line ${i+1}`);
                output.textContent = `SYNTAX ERROR (Line ${i+1}): Invalid identifier "${identifier}"`;
                return;
            }

            console.log(`Syntax OK at line ${i+1}`);
        }

        output.textContent = "SYNTAX ANALYSIS PASSED";
        console.log("Pasado mga bossing sa syntax GYAHAHA");
        semanBtn.disabled = false;
        lexiBtn.disabled = true;
        
        // need further testing, i give up for now
    };
    
    window.semanticAnalyzer = function() {

        let lines = fileContent.value.split("\n");

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();
            if (line === "") continue;

            console.log(`Analyzing semantics of line ${i+1}: "${line}"`);

            line = line.replace(";", "");
            let type = line.split(/\s+/)[0];

            let rest = line.substring(type.length).trim();

            console.log(`Type: "${type}", Remaining: "${rest}"`);

            if (rest.includes("=")) {
                let [identifier, value] = rest.split("=");
                identifier = identifier.trim();
                value = value.trim();

                console.log(`Identifier: "${identifier}", Assigned value: "${value}"`);
                console.log(`Checking if value matches type "${type}"`);

                let valid = checkValueType(type, value);
                console.log(`Type check result:`, valid);

                if (!valid) {
                    console.error(`SEMANTIC ERROR at line ${i+1}: Value "${value}" invalid for type "${type}"`);
                    output.textContent = `SEMANTIC ERROR (Line ${i+1}): Value "${value}" not valid for type ${type}`;
                    return;
                }
            } else {
                console.log(`No assignment on line ${i+1}, skipping type check...`);
            }
        }

        output.textContent = "SEMANTIC ANALYSIS PASSED ";
        console.log("SEMANTIC ANALYZER PASSED - saki");
        syntaxBtn.disabled = true;
        lexiBtn.disabled = true;

    };
                
    function checkValueType(type, value) {
        console.log(`Checking type: ${type}, value: ${value}`);

        switch(type) {
            case "int":
                return /^[0-9]+$/.test(value);
            case "float":
            case "double":
                return /^[0-9]+(\.[0-9]+)?$/.test(value);
            case "boolean":
                return value === "true" || value === "false";
            case "char":
                return /^'[^']'$/.test(value);
            case "String":
                return /^"[^"]*"$/.test(value);
            default:
                return false;
        }
    }

});
