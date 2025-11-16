document.addEventListener('DOMContentLoaded', function() { // juste to ensure the DOM is fully loaded
    const fileInput = document.getElementById('fileInput');
    const fileContent = document.getElementById('fileContent');
    const lexiBtn = document.getElementById('lexicalbtn');
    const syntaxBtn = document.getElementById('syntaxbttn');
    const semanBtn = document.getElementById('semanticbtn');

    window.openFile = function() {
        const file = fileInput.files[0];
        const reader = new FileReader();
        reader.onload = function(e) {
            fileContent.value = e.target.result;
            lexiBtn.disabled = false;
            syntaxBtn.disabled = false;
            semanBtn.disabled = false;
        }
        reader.readAsText(file);
    }

    window.eraseText = function() {
        fileContent.value = ''; 
        lexiBtn.disabled = true;
        syntaxBtn.disabled = true;
        semanBtn.disabled = true;
    }

    window.lexicalAnalyzer = function() {
        
    }

    window.syntaxAnalyzer = function() {
        
    }

    window.semanticAnalyzer = function() {
        
    }
});

