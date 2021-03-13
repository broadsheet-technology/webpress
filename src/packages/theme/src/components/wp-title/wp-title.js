var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Component, Prop, h } from '@stencil/core';
let WebpressPost = class WebpressPost {
    render() {
        if (!this.post) {
            return;
        }
        let Element = this.el ? this.el : "h1";
        if (this.permalink) {
            return h("wp-link", { object: this.post },
                h(Element, { innerHTML: this.post.title }));
        }
        return h(Element, { innerHTML: this.post.title });
    }
};
__decorate([
    Prop()
], WebpressPost.prototype, "post", void 0);
__decorate([
    Prop()
], WebpressPost.prototype, "permalink", void 0);
__decorate([
    Prop()
], WebpressPost.prototype, "el", void 0);
WebpressPost = __decorate([
    Component({
        tag: 'wp-title'
    })
], WebpressPost);
export { WebpressPost };
