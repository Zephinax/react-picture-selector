// @ts-nocheck -- skip type checking
import * as docs_2 from "../content/docs/index.mdx?collection=docs"
import * as docs_1 from "../content/docs/03-api-and-styling.mdx?collection=docs"
import * as docs_0 from "../content/docs/02-installation.mdx?collection=docs"
import { _runtime } from "fumadocs-mdx/runtime/next"
import * as _source from "../source.config"
export const docs = _runtime.docs<typeof _source.docs>([{ info: {"path":"02-installation.mdx","fullPath":"content/docs/02-installation.mdx"}, data: docs_0 }, { info: {"path":"03-api-and-styling.mdx","fullPath":"content/docs/03-api-and-styling.mdx"}, data: docs_1 }, { info: {"path":"index.mdx","fullPath":"content/docs/index.mdx"}, data: docs_2 }], [])