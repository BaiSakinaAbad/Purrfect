document.addEventListener('DOMContentLoaded', function() {

    const fileInput = document.getElementById('fileInput');
    const fileContent = document.getElementById('fileContent');
    const lexiBtn = document.getElementById('lexicalbtn');
    const syntaxBtn = document.getElementById('syntaxbttn');
    const semanBtn = document.getElementById('semanticbtn');
    const eraseBtn = document.getElementById('clearbtn');
    const output = document.getElementById('output');

    // Initial state. only OPEN FILE is enabled
    lexiBtn.disabled = true;
    syntaxBtn.disabled = true;
    semanBtn.disabled = true;
    eraseBtn.disabled = true;

    const validTypes = ["int", "float", "double", "boolean", "char", "String"];

    //Assigned functions to window object so they're accessible from HTML onclick handlers
   window.openFile = function() {
    const file = fileInput.files[0];
    console.log("file:", file?.name);

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result.trim();  // Define content variable here 
        fileContent.value = content;
        console.log("File content loaded:\n", content);

        if (content === "") {  // content is defined to avoid reference error (wasn't defined before)
            output.textContent = "ERROR: File is empty!";
            lexiBtn.disabled = true;
            syntaxBtn.disabled = true;
            semanBtn.disabled = true;
            eraseBtn.disabled = true;
            return;
        }

        lexiBtn.disabled = false;
        syntaxBtn.disabled = true;
        semanBtn.disabled = true;
        eraseBtn.disabled = false;

        output.textContent = "OUTPUT";
    };
    reader.readAsText(file);
};

   
    window.eraseText = function() {
        
        fileContent.value = ''; 
        console.log("erased");

        lexiBtn.disabled = true;
        syntaxBtn.disabled = true;
        semanBtn.disabled = true;
         eraseBtn.disabled = true;  // Disable erase button after using it because by then the file is not loaded yet


        output.textContent = "OUTPUT";
    };

   // LEXICAL PHASE LOGIC
    window.lexicalAnalyzer = function() {
        
        let tokens = fileContent.value.split(/\s+/); // split by whitespace
        let tokenPattern = /^[a-zA-Z_][a-zA-Z0-9_]*$|^[0-9]+(\.[0-9]+)?$|^"[^"]*"|'[^']'|=|;$/;
        // identifiers  /^[a-zA-Z_][a-zA-Z0-9_]*$/
        // numbers  /^[0-9]+(\.[0-9]+)?$/
        // strings  /^"[^"]*"$/
        // chars  /^'[^']'$/
        // operator =  /^=$/
        // delimiter ;  /^;$/
    
        console.log("Tokens found:", tokens);

        for (let t of tokens) { // iterate through each token and check validity(if isValid, else error)
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
        for (let i = 0; i < lines.length; i++) { // iterate line by line to read file
            let line = lines[i].trim(); 
            if (line === "") continue;

            console.log(`Checking syntax of line ${i+1}: "${line}"`);

            if (!line.endsWith(";")) {  // first to check if ends with semicolon
                console.error(`SYNTAX ERROR`);
                output.textContent = `SYNTAX ERROR (Line ${i+1})`;
                return;
            }

            let words = line.replace(";", "").split(/\s+/); 

            let type = words[0];
            let identifier = words[1];

            console.log(`Parsed type: "${type}", identifier: "${identifier}"`); // log parsed components

            if (!validTypes.includes(type)) { // check if datatype is valid
                console.error(`SYNTAX ERROR: Invalid datatype "${type}" at line ${i+1}`);
                output.textContent = `SYNTAX ERROR (Line ${i+1}): Invalid data type "${type}"`;
                return;
            }

            if (!/^[a-zA-Z_][a-zA-Z0-9_]*$/.test(identifier)) { // check if identifier is valid
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
    
    window.semanticAnalyzer = function () {

    let lines = fileContent.value.split("\n");

    for (let i = 0; i < lines.length; i++) {
        let originalLine = lines[i];
        let line = originalLine.trim();

        if (line === "") continue;

        console.log(`\nSEMANTIC ANALYZING LINE ${i+1}`);
        console.log(`Raw line: "${originalLine}"`);
        console.log(`Trimmed line: "${line}"`);

        // Remove trailing semicolon
        if (line.endsWith(";")) {
            line = line.slice(0, -1).trim();
            console.log(`Removed ; at "${line}"`);
        }

        // Extract datatype (first token)
        let parts = line.split(/\s+/);
        let type = parts[0];

        console.log(`type = "${type}"`);

        // VALIDATE datatype
        const allowedTypes = ["int", "float", "double", "boolean", "char", "String", "string"];

        if (!allowedTypes.includes(type)) { // handle unknown datatype
            output.textContent = `SEMANTIC ERROR (Line ${i+1}): Unknown datatype "${type}"`;
            console.error(`Unknown datatype found`);
            return;
        }

        // Extract the rest after datatype
        let rest = line.substring(type.length).trim(); // get the rest of the line after datatype
        console.log(`Remaining expression: "${rest}"`); 

        if (rest.includes("=")) {// check if there's an assignment

            let [identifier, value] = rest.split("=");

            identifier = identifier.trim(); 
            value = value.trim();

            console.log(`Identifier: "${identifier}"`);
            console.log(`Assigned value: "${value}"`);

            // if value has spaces (string) → rejoin
            if (value.includes(" ")) {
                console.warn("Value had spaces");
            }

            // Use the improved checker
            let valid = checkValueType(type, value);

            console.log(`checkValueType("${type}", "${value}") → ${valid}`);

            if (!valid) {
                console.error(`SEMANTIC ERROR at line ${i+1}: Value "${value}" invalid for ${type}`);
                output.textContent = `SEMANTIC ERROR (Line ${i+1}): Value "${value}" not valid for type "${type}"`;
                return;
            }

        } else {
            console.log(`No assignment (=) found — semantic check skipped.`);
        }
    }

    // If all lines passed
    output.textContent = "SEMANTIC ANALYSIS PASSED";
    console.log("SEMANTIC ANALYZER PASSED!");

    // Disable previous buttons(except erase)
    syntaxBtn.disabled = true;
    lexiBtn.disabled = true;
};

                //  value type checker
    function checkValueType(type, value) {
        console.log(`Checking type: ${type}, value: ${value}`);

        switch(type) {
            case "int":
                return /^[0-9]+$/.test(value); // return true if value matches integer pattern
            case "float":
                 return /^[0-9]+(\.[0-9]+)?[f]$/.test(value);
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