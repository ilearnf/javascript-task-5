'use strict';

/**
 * Сделано задание на звездочку
 * Реализованы методы several и through
 */
getEmitter.isStar = false;
module.exports = getEmitter;

function EventTarget(context) {
    var target = this;
    target.target = context;
    target.callbacks = target.callbacks || {};
    target.on = function (event, fn, currentIdx) {
        target.callbacks[event] = target.callbacks[event] || [];
        target.callbacks[event].push({
            fn: fn,
            idx: currentIdx
        });
    };
    target.off = function (event) {
        Object.keys(target.callbacks).forEach(function (subscribedEvent) {
            if (subscribedEvent.indexOf(event) === 0) {
                target.callbacks[subscribedEvent] = [];
            }
        });
    };
    target.dispatch = function (event) {
        // target.callbacks[event].reverse();
        target.callbacks[event].forEach(function (fn) {
            fn.apply(target.target, arguments);
        });
        // target.callbacks[event].reverse();
    };

    return target;
}
function getAllNamespacedEvents(event) {
    var namespaces = event.split('.');
    var events = [];
    namespaces.forEach(function () {
        events.push(event);
        var lastDotIdx = event.lastIndexOf('.');
        if (lastDotIdx === -1) {
            return;
        }
        event = event.slice(0, lastDotIdx);
    });

    return events;
}

/**
 * Возвращает новый emitter
 * @returns {Object}
 */
function getEmitter() {
    return {
        observers: {},
        currentHandlerIdx: 0,

        /**
         * Подписаться на событие
         * @param {String} event
         * @param {Object} context
         * @param {Function} handler
         * @returns {Emitter}
         */
        on: function (event, context, handler) {
            console.info(event, context, handler);
            var target = new EventTarget(context);
            target.on(event, handler, this.currentHandlerIdx);
            this.observers[event] = this.observers[event] || [];
            var existingTargetIdx = this.observers[event].findIndex(function (target) {
                return target.target === context;
            });
            if (existingTargetIdx === -1) {
                this.observers[event].push(target);
            } else {
                his.observers[event][existingTargetIdx].on(event, handler, this.currentHandlerIdx);
            }
            this.currentHandlerIdx += 1;

            return this;
        },

        /**
         * Отписаться от события
         * @param {String} event
         * @param {Object} context
         * @returns {Emitter}
         */
        off: function (event, context) {
            console.info(event, context);
            var handlersToOff = this.observers[event].filter(function (observer) {
                return observer.target === context;
            });
            var self = this;
            Object.keys(this.observers).forEach(function (subscribedEvent) {
                var targetIdx = self.observers[subscribedEvent].findIndex(function (observer) {
                    return observer.target === context;
                });
                self.observers[subscribedEvent][targetIdx].off();
                if (subscribedEvent.indexOf(event) === 0 && subscribedEvent) {
                    self.observers[subscribedEvent].splice(targetIdx, 1);
                }
            });

            return this;
        },

        /**
         * Уведомить о событии
         * @param {String} event
         * @returns {Emitter}
         */
        emit: function (event) {
            console.info(event);
            var allEvents = getAllNamespacedEvents(event);
            var self = this;
            allEvents.forEach(function (eventWithoutNamespace) {
                if (typeof self.observers[eventWithoutNamespace] === 'undefined') {
                    return;
                }
                // self.observers[eventWithoutNamespace].reverse();
                var allHandlers = [];
                self.observers[eventWithoutNamespace].forEach(function (target) {
                    // target.dispatch(eventWithoutNamespace);
                    target.callbacks[eventWithoutNamespace].forEach(function (targetHandler) {
                        var handlerWithTarget = Object.assign({
                            target: target.target
                        }, targetHandler);
                        allHandlers.push(handlerWithTarget);
                    });
                });
                allHandlers.sort(function (a, b) {
                    return a.idx - b.idx;
                });
                allHandlers.forEach(function (handler) {
                    handler.fn.apply(handler.target, arguments);
                });
                // self.observers[eventWithoutNamespace].reverse();
            });

            return this;
        },

        /**
         * Подписаться на событие с ограничением по количеству полученных уведомлений
         * @star
         * @returns {Object}
         */
        several: function () {
            return this;
        },

        /**
         * Подписаться на событие с ограничением по частоте получения уведомлений
         * @star
         * @returns {Object}
         */
        through: function () {
            return this;
        }
    };
}
