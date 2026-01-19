"use strict";
var _createClass = function() {
    function s(t, e) {
        for (var i = 0; i < e.length; i++) {
            var s = e[i];
            s.enumerable = s.enumerable || !1, s.configurable = !0, "value" in s && (s.writable = !0), Object.defineProperty(t, s.key, s)
        }
    }
    return function(t, e, i) {
        return e && s(t.prototype, e), i && s(t, i), t
    }
}();

function _classCallCheck(t, e) {
    if (!(t instanceof e)) throw new TypeError("Cannot call a class as a function")
}

function debounce(s, a, r) {
    var n;
    return function() {
        var t = this,
            e = arguments,
            i = r && !n;
        clearTimeout(n), n = setTimeout(function() {
            n = null, r || s.apply(t, e)
        }, a), i && s.apply(t, e)
    }
}
window.location.origin || (window.location.origin = window.location.protocol + "//" + window.location.hostname + (window.location.port ? ":" + window.location.port : ""));
var preloadImage = function(e) {
        var i = !1;
        if (Array.from(document.querySelectorAll(".--preloaded-image")).forEach(function(t) {
                if (t.id == e) return !(i = !0)
            }), i) return !1;
        var t = new Image;
        t.src = e, t.id = e, t.classList.add("--preloaded-image"), document.body.appendChild(t)
    },
    Game = function() {
        function i(t) {
            var e = this;
            _classCallCheck(this, i), console.log(t), this.hideButton = t.hideButton, this.stage = 0, this.stages = [], this.defaultButtonImageUrl = "./images/red-button.png";

            // Сохраняем ссылки на Yandex SDK и игрока
            this.ysdk = t.ysdk || null;
            this.player = t.player || null;

            // Используем начальный этап из параметров или localStorage
            this.stage = t.initialStage !== undefined ? t.initialStage : (+window.localStorage.currentGameStage || 0);

            if (t.stagesUrl && "localhost" || "igroutka.ru" || "games.igroutka.ru" === window.location.hostname ? fetch(t.stagesUrl).then(function(t) {
                    return t.json()
                }).then(function(t) {
                    e.stages = t, e.stages.forEach(function(t, e) {
                        t.image && t.image.url && preloadImage(t.image.url)
                    }), e.handleClick()
                }) : t.stages && (this.stages = stages), !document.querySelector(t.wrapperSelector)) throw new Error("Game app wrapper not found by specified selector");
            this.appWrapper = document.querySelector(t.wrapperSelector), this.createMarkup(), this.button.addEventListener("click", debounce(this.handleClick.bind(this), t.clickDelay, !0));

            // Обработчик изменения размера окна для адаптивности
            var self = this;
            window.addEventListener("resize", debounce(function() {
                self.updateButtonSizes();
            }, 150));

            // Инициализация ResizeObserver для детекции изменения размера iFrame
            this.setupResizeObserver();
        }
        return _createClass(i, [{
            key: "createMarkup",
            value: function() {
                var e = this;
                if (this.buttonWrapper = document.createElement("div"), this.buttonWrapper.classList.add("button-wrapper"), this.appWrapper.appendChild(this.buttonWrapper), this.messageBox = document.createElement("div"), this.messageBox.classList.add("message-box"), this.appWrapper.appendChild(this.messageBox), this.button = document.createElement("div"), this.button.classList.add("button", "button--red", "button--true"), this.buttonWrapper.appendChild(this.button), this.buttonSize = parseInt(window.getComputedStyle(this.button).getPropertyValue("width")), this.buttonMargin = parseInt(window.getComputedStyle(this.button).getPropertyValue("margin")), this.hideButton) {
                    var t = document.createElement("div");
                    t.classList.add("hide-button"), this.appWrapper.after(t), "true" == localStorage.gameHiddenByButton ? (this.appWrapper.style.transition = "none", this.appWrapper.classList.add("hidden")) : this.appWrapper.classList.remove("hidden"), t.addEventListener("click", function(t) {
                        e.appWrapper.classList.contains("hidden") ? (e.appWrapper.classList.remove("hidden"), localStorage.gameHiddenByButton = !1) : (e.appWrapper.classList.add("hidden"), localStorage.gameHiddenByButton = !0)
                    })
                }
            }
        }, {
            key: "clearField",
            value: function() {
                var e = this;
                this.appWrapper.setAttribute("style", ""), this.button.setAttribute("style", ""), this.buttonWrapper.setAttribute("style", ""), this.currentPopup && this.currentPopup.classList.remove("visible"), this.currentAnimationClass && this.button.classList.remove(this.currentAnimationClass), this.button.classList.remove("button--green", "button--blue"), this.button.classList.add("button--red"), this.button.querySelector(".button-ref") && this.button.querySelector(".button-ref").remove(), Array.from(this.buttonWrapper.querySelectorAll(".button")).map(function(t) {
                    t != e.button && t.remove()
                })
            }
        }, {
            key: "saveProgress",
            value: function() {
                var e = this;
                // Сохраняем в localStorage
                window.localStorage.currentGameStage = this.stage;

                // Сохраняем в облачные сохранения Яндекса
                if (this.player) {
                    this.player.setData({
                        currentGameStage: this.stage
                    }).then(function() {
                        console.log('Cloud save successful, stage:', e.stage);
                    }).catch(function(err) {
                        console.log('Cloud save failed:', err);
                    });
                }
            }
        }, {
            key: "handleClick",
            value: function() {
                this.saveProgress();
                this.clearField();
                var t = this.stages[this.stage];
                if (t.skip) return this.messageBox.innerHTML = "Кнопка была нажата " + this.stage + " раз", void this.stage++;
                (this.messageBox.innerHTML = t.message, t.image ? (this.button.classList.add("button--custom"), this.button.style.backgroundImage = "url('" + t.image.url + "')") : this.button.classList.remove("button--custom"), t.backgroundImage) && (document.querySelector("body").style.backgroundImage = t.backgroundImage);
                if (t.transform && (this.button.style.transform = t.transform), t.animation && t.animation.class && (this.currentAnimationClass = t.animation.class, this.button.classList.add(t.animation.class)), t.multiply && "grid" == t.multiply.type) {
                    var e = t.multiply.x * t.multiply.y,
                        i = t.multiply.true.x + t.multiply.x * (t.multiply.true.y - 1),
                        s = {
                            size: 80,
                            margin: 10,
                            use: !1
                        };
                    this.appWrapper.offsetWidth <= t.multiply.x * (this.buttonSize + 2 * this.buttonMargin) ? (s.size = .8 * this.appWrapper.offsetWidth / t.multiply.x, s.margin = .1 * this.appWrapper.offsetWidth / t.multiply.x, s.use = !0, this.buttonWrapper.style.width = "100%", this.button.style.width = s.size + "px", this.button.style.height = s.size + "px", this.button.style.margin = s.margin + "px") : this.buttonWrapper.style.width = t.multiply.x * (this.buttonSize + 2 * this.buttonMargin) + "px";
                    for (var a = 1; a < e; a++) {
                        var r = document.createElement("div");
                        r.classList.add("button"), s.use && (r.style.width = s.size + "px", r.style.height = s.size + "px", r.style.margin = s.margin + "px"), a < i ? this.buttonWrapper.insertBefore(r, this.button) : this.buttonWrapper.appendChild(r)
                    }
                }
                if (t.multiply && "rgb" == t.multiply.type) {
                    for (var n = 1; n < 3; n++) {
                        var o = document.createElement("div");
                        o.classList.add("button"), n < t.multiply.true ? this.buttonWrapper.insertBefore(o, this.button) : this.buttonWrapper.appendChild(o)
                    }
                    this.buttonWrapper.querySelectorAll(".button")[0].classList.add("button--blue"), this.buttonWrapper.querySelectorAll(".button")[1].classList.add("button--red"), this.buttonWrapper.querySelectorAll(".button")[2].classList.add("button--green")
                }
                if (t.popup && (t.popup.classList.add("visible"), this.currentPopup = t.popup), t.randomize) {
                    var u = Math.floor(Math.random() * t.randomize.amount);
                    this.buttonWrapper.style.width = "100%";
                    for (var l = 0; l < t.randomize.amount; l++) {
                        var p = document.createElement("div");
                        p.classList.add("button");
                        var d = Math.random() + .5,
                            c = d * this.buttonSize,
                            h = d * this.buttonMargin;
                        switch (p.style.width = c + "px", p.style.height = c + "px", p.style.margin = h + "px", Math.floor(3 * d) % 3) {
                            case 0:
                                p.classList.add("button--blue");
                                break;
                            case 1:
                                p.classList.add("button--green")
                        }
                        if (l < u) this.buttonWrapper.insertBefore(p, this.button);
                        else if (l == u) {
                            switch (Math.floor(3 * d) % 3) {
                                case 0:
                                    this.button.classList.add("button--blue");
                                    break;
                                case 1:
                                    this.button.classList.add("button--green")
                            }
                            this.button.style.width = c + "px", this.button.style.height = c + "px", this.button.style.margin = h + "px"
                        } else this.buttonWrapper.appendChild(p)
                    }
                }
                if (t.removeElements && (t.removeElements.forEach(function(t) {
                        var e = document.querySelector(t);
                        e && e.remove()
                    }), document.querySelector("#news").style.background = "transparent"), t.link) {
                    var m = document.createElement("a");
                    m.setAttribute("href", t.link), m.setAttribute("target", "_top"), m.classList.add("button-ref"), this.button.appendChild(m)
                }
                t.restart && this.reset(), this.stage++
            }
        }, {
            key: "setupResizeObserver",
            value: function() {
                var self = this;

                // Проверяем поддержку ResizeObserver
                if (typeof ResizeObserver === 'undefined') {
                    console.log('ResizeObserver not supported, using fallback');
                    return;
                }

                // Сохраняем предыдущие размеры для оптимизации
                this.lastWidth = 0;
                this.lastHeight = 0;

                // Создаём ResizeObserver для наблюдения за изменениями размера контейнера
                this.resizeObserver = new ResizeObserver(debounce(function(entries) {
                    for (var i = 0; i < entries.length; i++) {
                        var entry = entries[i];
                        var width = entry.contentRect.width;
                        var height = entry.contentRect.height;

                        // Проверяем, действительно ли изменился размер (порог 5px)
                        if (Math.abs(width - self.lastWidth) > 5 || Math.abs(height - self.lastHeight) > 5) {
                            self.lastWidth = width;
                            self.lastHeight = height;

                            console.log('iFrame/Container resized:', width, 'x', height);

                            // Обновляем CSS переменные для динамического масштабирования
                            self.updateCSSVariables(width, height);

                            // Обновляем размеры кнопок
                            self.updateButtonSizes();
                        }
                    }
                }, 100));

                // Наблюдаем за #btn-wrap (основной контейнер)
                var btnWrap = document.getElementById('btn-wrap');
                if (btnWrap) {
                    this.resizeObserver.observe(btnWrap);
                }

                // Также наблюдаем за body для детекции изменения размера iFrame
                this.resizeObserver.observe(document.body);

                // Инициализируем CSS переменные при старте
                this.updateCSSVariables(window.innerWidth, window.innerHeight);
            }
        }, {
            key: "updateCSSVariables",
            value: function(width, height) {
                var root = document.documentElement;

                // Вычисляем масштабный коэффициент на основе размера контейнера
                var minDimension = Math.min(width, height);
                var scaleFactor = Math.max(0.5, Math.min(1.5, minDimension / 400));

                // Вычисляем размеры компонентов
                var buttonSize = Math.max(40, Math.min(120, minDimension * 0.2));
                var buttonMargin = Math.max(3, Math.min(15, minDimension * 0.025));
                var fontSize = Math.max(12, Math.min(20, minDimension * 0.04));
                var customButtonSize = buttonSize * 1.25;

                // Устанавливаем CSS переменные
                root.style.setProperty('--scale-factor', scaleFactor);
                root.style.setProperty('--dynamic-button-size', buttonSize + 'px');
                root.style.setProperty('--dynamic-button-margin', buttonMargin + 'px');
                root.style.setProperty('--dynamic-font-size', fontSize + 'px');
                root.style.setProperty('--dynamic-custom-button-size', customButtonSize + 'px');
                root.style.setProperty('--container-width', width + 'px');
                root.style.setProperty('--container-height', height + 'px');

                // Определяем ориентацию контейнера
                var isLandscape = width > height;
                root.style.setProperty('--is-landscape', isLandscape ? '1' : '0');
            }
        }, {
            key: "updateButtonSizes",
            value: function() {
                // Обновляем базовые размеры кнопки из CSS
                this.buttonSize = parseInt(window.getComputedStyle(this.button).getPropertyValue("width"));
                this.buttonMargin = parseInt(window.getComputedStyle(this.button).getPropertyValue("margin"));

                // Получаем размеры контейнера
                var containerWidth = this.appWrapper.offsetWidth;
                var containerHeight = this.appWrapper.offsetHeight || window.innerHeight;

                // Пересчитываем размеры сетки кнопок если они есть
                var buttons = this.buttonWrapper.querySelectorAll(".button");
                if (buttons.length > 1) {
                    var t = this.stages[this.stage - 1]; // Текущий этап (stage уже увеличен)
                    if (t && t.multiply && "grid" == t.multiply.type) {
                        var gridX = t.multiply.x;
                        var gridY = t.multiply.y;

                        // Вычисляем оптимальный размер кнопки для сетки
                        var availableWidth = containerWidth - 20; // padding
                        var availableHeight = containerHeight * 0.6; // оставляем место для message-box

                        var maxButtonWidth = (availableWidth * 0.9) / gridX;
                        var maxButtonHeight = (availableHeight * 0.9) / gridY;
                        var optimalSize = Math.min(maxButtonWidth, maxButtonHeight);

                        var s = {
                            size: Math.max(30, Math.min(100, optimalSize * 0.8)),
                            margin: Math.max(2, Math.min(15, optimalSize * 0.1)),
                            use: false
                        };

                        // Проверяем, помещается ли сетка в контейнер
                        if (containerWidth <= gridX * (this.buttonSize + 2 * this.buttonMargin)) {
                            s.use = true;
                            this.buttonWrapper.style.width = "100%";
                        } else {
                            this.buttonWrapper.style.width = gridX * (this.buttonSize + 2 * this.buttonMargin) + "px";
                        }

                        if (s.use) {
                            buttons.forEach(function(btn) {
                                btn.style.width = s.size + "px";
                                btn.style.height = s.size + "px";
                                btn.style.margin = s.margin + "px";
                            });
                        } else {
                            buttons.forEach(function(btn) {
                                btn.style.width = "";
                                btn.style.height = "";
                                btn.style.margin = "";
                            });
                        }
                    }
                }

                // Обновляем размеры для режима randomize
                if (buttons.length > 1) {
                    var currentStage = this.stages[this.stage - 1];
                    if (currentStage && currentStage.randomize) {
                        var self = this;
                        var baseSize = Math.min(containerWidth * 0.15, 80);
                        buttons.forEach(function(btn) {
                            var currentWidth = parseInt(btn.style.width) || self.buttonSize;
                            var scale = currentWidth / self.buttonSize;
                            var newSize = baseSize * scale;
                            var newMargin = newSize * 0.125;
                            btn.style.width = newSize + "px";
                            btn.style.height = newSize + "px";
                            btn.style.margin = newMargin + "px";
                        });
                    }
                }
            }
        }, {
            key: "reset",
            value: function() {
                window.localStorage.currentGameStage = 0;
                this.stage = 0;

                // Сбрасываем облачное сохранение
                if (this.player) {
                    this.player.setData({
                        currentGameStage: 0
                    }).catch(function(err) {
                        console.log('Cloud save reset failed:', err);
                    });
                }

                this.clearField();
                this.handleClick();
            }
        }]), i
    }();
