/****************************************************************************************************/

const Methods =
{
    displayBackground()
    {
        if(document.getElementById('requestBackground')) return;

        var background  = document.createElement('div');
        var container   = document.createElement('div');

        background      .setAttribute('id', 'requestBackground');
        container       .setAttribute('id', 'requestContainer');

        background      .setAttribute('class', 'requestBackground');
        container       .setAttribute('class', 'requestContainer');

        document.body.appendChild(background);
        document.body.appendChild(container);
    },

    displayLoader(callback)
    {
        var loader      = document.createElement('div');

        loader          .setAttribute('id', 'requestLoader');
        loader          .setAttribute('class', 'requestLoader');

        document.getElementById('requestContainer').appendChild(loader);

        return callback(loader);
    },

    displayError(errorMessage) 
    {
        if(document.getElementById('requestContainer') == null) return;
        if(document.getElementById('requestBackground') == null) return;

        var errorBlock  = document.createElement('div');
        var errorClose  = document.createElement('button');

        errorBlock      .setAttribute('class', 'requestError');
        errorClose      .setAttribute('class', 'requestErrorClose');

        errorBlock      .innerHTML += `<div class="requestErrorTitle">Error</div>`;
        errorBlock      .innerHTML += `<div class="requestErrorMessage">${errorMessage}</div>`;

        errorClose      .innerText = 'Close';

        errorClose      .addEventListener('click', () => 
        {
            document.getElementById('requestContainer').remove();
            document.getElementById('requestBackground').remove();
        });

        errorBlock      .appendChild(errorClose);

        document.getElementById('requestContainer').appendChild(errorBlock);
    },

    displaySuccess(successMessage) 
    {
        if(document.getElementById('requestContainer') == null) return;
        if(document.getElementById('requestBackground') == null) return;

        var successBlock  = document.createElement('div');
        var successClose  = document.createElement('button');

        successBlock      .setAttribute('class', 'requestSuccess');
        successClose      .setAttribute('class', 'requestSuccessClose');

        successBlock      .innerHTML += `<div class="requestSuccessTitle">Success</div>`;
        successBlock      .innerHTML += `<div class="requestSuccessMessage">${successMessage}</div>`;

        successClose      .innerText = 'Close';

        successClose      .addEventListener('click', () => 
        {
            document.getElementById('requestContainer').remove();
            document.getElementById('requestBackground').remove();
        });

        successBlock      .appendChild(successClose);

        document.getElementById('requestContainer').appendChild(successBlock);
    }
}

/****************************************************************************************************/

export default Methods;