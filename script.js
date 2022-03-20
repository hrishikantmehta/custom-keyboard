var txt = document.getElementById("inputEmail3"); //hidden original text
var showInput = document.getElementById("showInput"); //converted text

txt.addEventListener("input", (e) => {
    // console.log(e.target.value);
    // showInput.value = e.target.value;

    let keys = document.getElementById("keys").value;
    let values = document.getElementById("values").value;

    let map = {};
    for (let i = 0; i < (keys.length < values.length ? keys.length : values.length); i++)
        map[keys[i]] = values[i];

    // console.log(map);

    let text = e.target.value;
    let encText = "";

    for (let i = 0; i < text.length; i++) {
        if (text[i] in map)
            encText += map[text[i]];
        else
            encText += text[i];
    }

    showInput.value = encText;
});

var VirtualKeyboard = {
    generate: function(target, matrix, language, uppercase = false) {
        var owner = this;

        for (var i = 0; i < matrix.length; i++) {
            var position = matrix[i];

            var vkr = document.createElement('div');
            vkr.setAttribute('class', 'virtual-keyboard-row');

            var vkc = document.createElement('div');
            vkc.setAttribute('class', 'virtual-keyboard-column');

            for (var j = 0; j < position.length; j++) {
                var button = document.createElement('button');

                switch (matrix[i][j]) {
                    case '+backspace':
                        button.innerHTML = '<i class="fa fa-fw fa-long-arrow-left"></i>';
                        button.setAttribute('data-trigger', 'backspace');
                        button.setAttribute('title', 'Backspace');
                        /* the slicing using timer */
                        var mouseTimerHandler = null;
                        button.addEventListener("mousedown", function(event) {

                            mouseTimerHandler = setInterval(function() {
                                if (event.which == 1) {
                                    _lastElementFocused.value = _lastElementFocused.value.slice(0, -1);
                                }
                            }, 200);
                        }, false);
                        button.addEventListener("mouseup", function() {
                            clearTimeout(mouseTimerHandler);
                        });
                        break;
                    case '+international':
                        button.innerHTML = '<i class="fa fa-fw fa-globe"></i>';
                        button.setAttribute('data-trigger', 'international');
                        button.setAttribute('title', 'International');
                        break;
                    case '+shift':
                        button.innerHTML = '<i class="fa fa-fw fa-arrow-up"></i>';
                        button.setAttribute('data-trigger', 'shift');
                        button.setAttribute('title', 'Shift');
                        break;
                    case '+space':
                        button.innerHTML = '&nbsp;';
                        button.setAttribute('data-trigger', 'space');
                        button.setAttribute('title', 'Space');
                        button.style.width = '75%';
                        break;

                    default:
                        button.innerText = uppercase ? (matrix[i][j]).toUpperCase() : matrix[i][j];
                        break;
                }

                button.setAttribute('class', 'virtual-keyboard-button');
                button.addEventListener('click', function() {
                    _lastElementFocused.focus();
                    var x = this.getAttribute('data-trigger');
                    if (x != null) {
                        switch (x) {
                            case 'backspace':
                                _lastElementFocused.value = _lastElementFocused.value.slice(0, -1);
                                break;
                            case 'space':
                                _lastElementFocused.value = _lastElementFocused.value + ' ';
                                break;
                            case 'shift':
                                var u = uppercase === true ? false : true;
                                target.innerHTML = '';
                                owner.generate(target, owner.getMatrix(language), language, u);
                                break;
                        }
                    } else {
                        _lastElementFocused.value = _lastElementFocused.value + this.innerText;
                    }
                    txt.dispatchEvent(new Event('input'));
                });
                vkc.appendChild(button);

                vkr.appendChild(vkc);
                target.appendChild(vkr);
            }
        }
    },
    getMatrix: function(language) {
        var matrix = {
            en: [
                ['1', '2', '3', '4', '5', '6', '7', '8', '9', '0', '+backspace'],
                ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p', '-'],
                ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l', '+'],
                ['@', 'z', 'x', 'c', 'v', 'b', 'n', 'm', '.', '_'],
                ['+shift', '+space', '+international']
            ],
        };
        return matrix[language];
    },
    init: function(args) {
        if (args != undefined && args != null) {
            if (Object.keys(args).length > 0) {
                var owner = this;

                window._lastElementFocused = null;

                var target = document.getElementById(args['targetId']);
                var language = args['defaultLanguage'];
                var elements = document.querySelectorAll(args['inputSelector']);

                _lastElementFocused = elements[0];

                for (var i = 0; i < elements.length; i++) {
                    elements[i].addEventListener('focus', function() {
                        _lastElementFocused = this;
                    });
                }
                owner.generate(target, owner.getMatrix(language), language);
            }
        }
    }
}

VirtualKeyboard.init({ targetId: 'tabular-virtual-keyboard', defaultLanguage: 'en', inputSelector: '[data-virtual-element]' });