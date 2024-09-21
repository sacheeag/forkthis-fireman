document.addEventListener('DOMContentLoaded', () => {
    const scoreMessage = document.getElementById('score-message');

    
    const score = localStorage.getItem('gameScore');

    if (score !== null) {
        scoreMessage.textContent = `Congratulations! Your score is ${score}.`;
    } else {
        scoreMessage.textContent = 'Score not found.';
    }
//Redirect to the main page
});





