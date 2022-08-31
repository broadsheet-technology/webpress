import { Media } from "./Media";
import { Connection, Route } from "./Connection";
import { Retrievable } from "./Retrievable";
import { Author } from "./Author";
import { Query } from "./Query";
import { LinkedQueryArgs } from "./Linked";

export interface Single extends Retrievable<Single> {}
export abstract class Single {
  constructor(readonly connection: Connection, protected json: any) {}

  get title(): string {
    return this.json.title.rendered;
  }

  get excerpt(): string {
    return this.json.excerpt.rendered;
  }

  get subhead(): string {
    return this.json.subhead;
  }

  get featuredMedia(): Promise<Media> {
    return new Query(
      this.connection,
      new LinkedQueryArgs(Media, new Route("media"), this.json.featured_media)
    ).result;
  }

  get date(): Date {
    return new Date(this.json.date);
  }

  get link(): string {
    return this.json.link;
  }

  get author(): Promise<Author> {
    let args = new LinkedQueryArgs(
      Author,
      new Route("author"),
      this.json.author_id
    );
    return new Query(this.connection, args).result;
  }

  get id(): number {
    return parseInt(this.json.id, 10);
  }

  get content(): string {
    return this.json.content.rendered;
  }
}
