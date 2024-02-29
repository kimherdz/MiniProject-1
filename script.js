let currentQI = 0;
let score = 0;
let tData = {};

async function fData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`Error fetching data.`);
        }

        const data = await response.json();
        const shuffleQ = shuffleArray(data.questions);

        const selectQ = shuffleQ.slice(0, 3);

        return { questions: selectQ };
    } catch (error) {
        console.error('Error fetching data:', error);
        return { questions: [] };
    }
}

function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
}

async function fetchQ() {
    return await fData('https://raw.githubusercontent.com/kimherdz/MiniProject-1/master/question.json');
}

function loadQ(question) {
    const questionC = document.getElementById('question-container');
    const optionsC = document.getElementById('options-container');
    const scoreC = document.getElementById('score-container');

    if (question && question.question) {
        questionC.innerHTML = `<p>${question.question}</p>`;

        optionsC.innerHTML = '';
        question.options.forEach((option, index) => {
            const button = document.createElement('button');
            button.className = 'btn btn-outline-primary mx-2';
            button.textContent = option;
            button.addEventListener('click', () => checkAnswer(option === question.answer));
            optionsC.appendChild(button);
        });

        scoreC.textContent = `Score: ${score}`;

    } else {
        console.error('Invalid question format:', question);
        questionC.innerHTML = '<p>Error loading question. Please try again.</p>';
    }
}

function checkAnswer(isCorrect) {
    const currentQuestion = tData.questions[currentQI];
    if (isCorrect) {
        score++;
    } else {
        
    }
    
    currentQI++;
    
    if (currentQI < tData.questions.length) {
        loadQ(tData.questions[currentQI]);
    } else {
        alert(`Game Over! Your final score is ${score}`);
        restartTrivia();
    }
}

function restartTrivia() {
    currentQI = 0;
    score = 0;
    fetchAndLoadQuestions(); 
}

async function fetchAndLoadQuestions() {
    tData = await fetchQ();
    console.log('Fetched Data:', tData);

    if (tData.questions && tData.questions.length > 0) {
        loadQ(tData.questions[currentQI]);
    } else {
        alert('Error fetching questions.');
    }
}

window.addEventListener('load', fetchAndLoadQuestions);