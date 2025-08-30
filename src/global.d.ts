declare module '*.module.scss' {
  const classes: Record<string, string>;
  export default classes;
}
declare module '*.scss';
declare module '*.module.css' {
  const classes: Record<string, string>;
  export default classes;
}
declare module '*.css';

  declare module '*.svg' {
    const content: string;
    export default content;
  }