export interface FormDataParams {
  [key: string]: any;
}

export class FormDataFields<Record extends FormDataParams = FormDataParams> extends FormData {
  public props: Record;

  public constructor(props: Record) {
    super();
    this.props = props;

    for (const key in props) {
      if (props[key] === undefined) continue;
      if (Array.isArray(props[key])) {
        props[key].forEach((item: any) => {
          if (item instanceof File) {
            this.append(key, item);
          } else {
            this.append(key, JSON.stringify(item));
          }
        });
      } else {
        this.append(key, props[key]);
      }
    }
  }
}
