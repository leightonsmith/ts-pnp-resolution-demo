// This is because AWS @types are not available
// @see https://github.com/aws-amplify/amplify-js/issues/2460

declare module '@fortawesome/fontawesome-free';

declare module 'react-markdown/plugins/html-parser' {
  import { MdastPlugin } from 'react-markdown';
  export interface HtmlParser {
    (config: {
      isValidNode: (node: Record<string, string>) => boolean;
    }): MdastPlugin;
  }
  declare const htmlParser: HtmlParser;
  export default htmlParser;
}

declare module 'react-jsonschema-form/lib/validate' {
  import { JSONSchema6Definition } from 'json-schema';
  import { AjvError } from 'react-jsonschema-form';

  export default function validateFormData<T = any>(
    formData: T,
    schema: JSONSchema6Definition
  ): {
    readonly errors: AjvError[];
  };
}
