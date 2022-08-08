let steps = document.querySelectorAll('[data-toggle-step]');

steps.forEach(step => {

    step.addEventListener('click', () => {
        let targetClass = step.dataset.toggleStep;
        let currSteps = document.querySelectorAll('.step.show');
        let targets = document.querySelectorAll('[data-step=' + targetClass + ']');

        currSteps.forEach(currStep => currStep.classList.remove('show'));
        targets.forEach(target => target.classList.add('show'));

        document.dispatchEvent(new CustomEvent('step:show'));
    });

});