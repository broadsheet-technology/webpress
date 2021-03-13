var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Prop, Element, State, h, Listen } from '@stencil/core';
import { Connection, Theme, Template } from '@webpress/core';
let WebpressTheme = class WebpressTheme {
    async updateTemplate(event) {
        let path = event.detail.url;
        window.history.pushState(path, "here!!", path);
        this.query = new Template.Query(this.connection, {
            path: path
        });
    }
    async handleBackButton(event) {
        this.query = new Template.Query(this.connection, {
            path: event.state
        });
    }
    async componentWillRender() {
        this.connection = new Connection(this.global.context);
        this.query = new Template.Query(this.connection, {
            path: window.location.pathname
        });
    }
    render() {
        if (!this.global.context) {
            return;
        }
        const ThemeRoot = this.global.theme.root;
        return (h(ThemeRoot, { theme: new Theme(this.connection, this.global.theme), query: this.query }));
    }
};
__decorate([
    Prop()
], WebpressTheme.prototype, "global", void 0);
__decorate([
    Element()
], WebpressTheme.prototype, "el", void 0);
__decorate([
    State()
], WebpressTheme.prototype, "query", void 0);
__decorate([
    Listen('webpressRouterNavigation')
], WebpressTheme.prototype, "updateTemplate", null);
__decorate([
    Listen("popstate", { target: "window" })
], WebpressTheme.prototype, "handleBackButton", null);
WebpressTheme = __decorate([
    Component({
        tag: 'webpress-theme',
    })
], WebpressTheme);
export { WebpressTheme };
