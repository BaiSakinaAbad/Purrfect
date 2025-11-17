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
        
    };
    window.semanticAnalyzer = function() {
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
