/**
 * Default translations for @raphi93/shome-components.
 *
 * Usage in your app:
 *
 *   import { registerShomeTranslations } from '@raphi93/shome-components';
 *   import i18n from './i18n';
 *
 *   // Call BEFORE your own translations so the web app has priority.
 *   registerShomeTranslations(i18n);
 *
 * The web app can override any key by simply defining it in its own translation files.
 * Library translations are added with `overwrite: false` — existing keys always win.
 */

export type ShomeLang = 'de' | 'en' | 'fr' | 'it' | 'es';

export type ShomeTranslationKeys =
  // General
  | 'Ok'
  | 'Cancel'
  | 'Logo'
  // Media
  | 'No image'
  | 'Image'
  | 'Document'
  | 'Iframe'
  // ChatBot
  | 'Type your message...'
  // Pager
  | 'First page'
  | 'Previous page'
  | 'Next page'
  | 'Last page'
  | 'Page size'
  // Grid
  | 'No data'
  // FieldWrapper
  | 'Click to reset input value to initial state'
  | 'The value'
  | 'Is required'
  // Sidebar roles
  | 'Admin'
  | 'Intern'
  | 'Named'
  | 'Zone'
  | 'Fleet'
  | 'Groups'
  | 'Dealer'
  | 'Person'
  // TextEditor
  | 'Show source'
  | 'Show visual'
  | 'HTML'
  | 'Markdown'
  // TextEditorToolbar
  | 'Bold'
  | 'Italic'
  | 'Strikethrough'
  | 'Heading 1'
  | 'Heading 2'
  | 'Heading 3'
  | 'Bullet list'
  | 'Ordered list'
  | 'Quote'
  | 'Code block'
  | 'Undo'
  | 'Redo';

export type ShomeTranslations = Record<ShomeLang, Record<ShomeTranslationKeys, string>>;

export const shomeTranslations: ShomeTranslations = {
  de: {
    // General
    'Ok': 'Ok',
    'Cancel': 'Abbrechen',
    'Logo': 'Logo',
    // Media
    'No image': 'Kein Bild',
    'Image': 'Bild',
    'Document': 'Dokument',
    'Iframe': 'Eingebetteter Inhalt',
    // ChatBot
    'Type your message...': 'Nachricht eingeben...',
    // Pager
    'First page': 'Erste Seite',
    'Previous page': 'Vorherige Seite',
    'Next page': 'Nächste Seite',
    'Last page': 'Letzte Seite',
    'Page size': 'Seitengrösse',
    // Grid
    'No data': 'Keine Daten',
    // FieldWrapper
    'Click to reset input value to initial state': 'Klicken um Eingabewert zurückzusetzen',
    'The value': 'Der Wert',
    'Is required': 'Ist erforderlich',
    // Sidebar roles
    'Admin': 'Admin',
    'Intern': 'Intern',
    'Named': 'Named',
    'Zone': 'Zone',
    'Fleet': 'Flotte',
    'Groups': 'Gruppen',
    'Dealer': 'Händler',
    'Person': 'Person',
    // TextEditor
    'Show source': 'Quelltext anzeigen',
    'Show visual': 'Vorschau anzeigen',
    'HTML': 'HTML',
    'Markdown': 'Markdown',
    // TextEditorToolbar
    'Bold': 'Fett',
    'Italic': 'Kursiv',
    'Strikethrough': 'Durchgestrichen',
    'Heading 1': 'Überschrift 1',
    'Heading 2': 'Überschrift 2',
    'Heading 3': 'Überschrift 3',
    'Bullet list': 'Aufzählungsliste',
    'Ordered list': 'Nummerierte Liste',
    'Quote': 'Zitat',
    'Code block': 'Code-Block',
    'Undo': 'Rückgängig',
    'Redo': 'Wiederholen',
  },

  en: {
    'Ok': 'Ok',
    'Cancel': 'Cancel',
    'Logo': 'Logo',
    'No image': 'No image',
    'Image': 'Image',
    'Document': 'Document',
    'Iframe': 'Iframe',
    'Type your message...': 'Type your message...',
    'First page': 'First page',
    'Previous page': 'Previous page',
    'Next page': 'Next page',
    'Last page': 'Last page',
    'Page size': 'Page size',
    'No data': 'No data',
    'Click to reset input value to initial state': 'Click to reset input value to initial state',
    'The value': 'The value',
    'Is required': 'Is required',
    'Admin': 'Admin',
    'Intern': 'Internal',
    'Named': 'Named',
    'Zone': 'Zone',
    'Fleet': 'Fleet',
    'Groups': 'Groups',
    'Dealer': 'Dealer',
    'Person': 'Person',
    'Show source': 'Show source',
    'Show visual': 'Show visual',
    'HTML': 'HTML',
    'Markdown': 'Markdown',
    'Bold': 'Bold',
    'Italic': 'Italic',
    'Strikethrough': 'Strikethrough',
    'Heading 1': 'Heading 1',
    'Heading 2': 'Heading 2',
    'Heading 3': 'Heading 3',
    'Bullet list': 'Bullet list',
    'Ordered list': 'Ordered list',
    'Quote': 'Quote',
    'Code block': 'Code block',
    'Undo': 'Undo',
    'Redo': 'Redo',
  },

  fr: {
    'Ok': 'Ok',
    'Cancel': 'Annuler',
    'Logo': 'Logo',
    'No image': 'Aucune image',
    'Image': 'Image',
    'Document': 'Document',
    'Iframe': 'Contenu intégré',
    'Type your message...': 'Tapez votre message...',
    'First page': 'Première page',
    'Previous page': 'Page précédente',
    'Next page': 'Page suivante',
    'Last page': 'Dernière page',
    'Page size': 'Taille de page',
    'No data': 'Aucune donnée',
    'Click to reset input value to initial state': 'Cliquer pour réinitialiser la valeur',
    'The value': 'La valeur',
    'Is required': 'Est requis',
    'Admin': 'Admin',
    'Intern': 'Interne',
    'Named': 'Nommé',
    'Zone': 'Zone',
    'Fleet': 'Flotte',
    'Groups': 'Groupes',
    'Dealer': 'Revendeur',
    'Person': 'Personne',
    'Show source': 'Afficher la source',
    'Show visual': 'Afficher l\'aperçu',
    'HTML': 'HTML',
    'Markdown': 'Markdown',
    'Bold': 'Gras',
    'Italic': 'Italique',
    'Strikethrough': 'Barré',
    'Heading 1': 'Titre 1',
    'Heading 2': 'Titre 2',
    'Heading 3': 'Titre 3',
    'Bullet list': 'Liste à puces',
    'Ordered list': 'Liste numérotée',
    'Quote': 'Citation',
    'Code block': 'Bloc de code',
    'Undo': 'Annuler',
    'Redo': 'Rétablir',
  },

  it: {
    'Ok': 'Ok',
    'Cancel': 'Annulla',
    'Logo': 'Logo',
    'No image': 'Nessuna immagine',
    'Image': 'Immagine',
    'Document': 'Documento',
    'Iframe': 'Contenuto incorporato',
    'Type your message...': 'Scrivi il tuo messaggio...',
    'First page': 'Prima pagina',
    'Previous page': 'Pagina precedente',
    'Next page': 'Pagina successiva',
    'Last page': 'Ultima pagina',
    'Page size': 'Dimensione pagina',
    'No data': 'Nessun dato',
    'Click to reset input value to initial state': 'Clicca per reimpostare il valore',
    'The value': 'Il valore',
    'Is required': 'È obbligatorio',
    'Admin': 'Admin',
    'Intern': 'Interno',
    'Named': 'Nominato',
    'Zone': 'Zona',
    'Fleet': 'Flotta',
    'Groups': 'Gruppi',
    'Dealer': 'Rivenditore',
    'Person': 'Persona',
    'Show source': 'Mostra sorgente',
    'Show visual': 'Mostra anteprima',
    'HTML': 'HTML',
    'Markdown': 'Markdown',
    'Bold': 'Grassetto',
    'Italic': 'Corsivo',
    'Strikethrough': 'Barrato',
    'Heading 1': 'Titolo 1',
    'Heading 2': 'Titolo 2',
    'Heading 3': 'Titolo 3',
    'Bullet list': 'Elenco puntato',
    'Ordered list': 'Elenco numerato',
    'Quote': 'Citazione',
    'Code block': 'Blocco di codice',
    'Undo': 'Annulla',
    'Redo': 'Ripristina',
  },

  es: {
    'Ok': 'Ok',
    'Cancel': 'Cancelar',
    'Logo': 'Logo',
    'No image': 'Sin imagen',
    'Image': 'Imagen',
    'Document': 'Documento',
    'Iframe': 'Contenido incrustado',
    'Type your message...': 'Escribe tu mensaje...',
    'First page': 'Primera página',
    'Previous page': 'Página anterior',
    'Next page': 'Página siguiente',
    'Last page': 'Última página',
    'Page size': 'Tamaño de página',
    'No data': 'Sin datos',
    'Click to reset input value to initial state': 'Haz clic para restablecer el valor',
    'The value': 'El valor',
    'Is required': 'Es requerido',
    'Admin': 'Admin',
    'Intern': 'Interno',
    'Named': 'Nombrado',
    'Zone': 'Zona',
    'Fleet': 'Flota',
    'Groups': 'Grupos',
    'Dealer': 'Distribuidor',
    'Person': 'Persona',
    'Show source': 'Mostrar fuente',
    'Show visual': 'Mostrar vista previa',
    'HTML': 'HTML',
    'Markdown': 'Markdown',
    'Bold': 'Negrita',
    'Italic': 'Cursiva',
    'Strikethrough': 'Tachado',
    'Heading 1': 'Encabezado 1',
    'Heading 2': 'Encabezado 2',
    'Heading 3': 'Encabezado 3',
    'Bullet list': 'Lista con viñetas',
    'Ordered list': 'Lista ordenada',
    'Quote': 'Cita',
    'Code block': 'Bloque de código',
    'Undo': 'Deshacer',
    'Redo': 'Rehacer',
  },
};

/**
 * Minimal i18n interface — avoids importing i18next directly.
 * Compatible with i18next's `i18n` instance.
 */
type I18nLike = {
  addResourceBundle(
    lng: string,
    ns: string,
    resources: object,
    deep?: boolean,
    overwrite?: boolean
  ): void;
};

/**
 * Registers shome-components default translations into your i18next instance.
 * Call this BEFORE adding your own translations so the web app has priority.
 *
 * @param i18n - Your i18next instance
 * @param ns - Namespace to register into (default: 'translation')
 */
export function registerShomeTranslations(i18n: I18nLike, ns = 'translation'): void {
  (Object.keys(shomeTranslations) as ShomeLang[]).forEach((lng) => {
    // deep: true — merge, overwrite: false — web app keys always win
    i18n.addResourceBundle(lng, ns, shomeTranslations[lng], true, false);
  });
}
