// Decap CMS configuration: what editors see at /admin/.
// Field names must match the content model in src/content/types.ts.
import type { CmsCollection, CmsConfig, CmsField } from 'decap-cms-core';
import { CMS_AUTH_URL, CMS_BRANCH, CMS_REPO, SITE_URL } from './settings';

/* ── Reusable fields ───────────────────────────────────────────────────────── */

// i18n: true       → translated (editors fill English and Indonesian)
// i18n: 'duplicate' → same in both languages (images, numbers, switches)

const text = (name: string, label: string, hint?: string, required = false): CmsField => ({
  name,
  label,
  widget: 'string',
  required,
  hint,
  i18n: true,
});

const longText = (name: string, label: string, hint?: string): CmsField => ({
  name,
  label,
  widget: 'text',
  required: false,
  hint,
  i18n: true,
});

const richText = (name: string, label: string, hint?: string): CmsField => ({
  name,
  label,
  widget: 'markdown',
  required: false,
  hint,
  i18n: true,
  modes: ['rich_text'],
  buttons: ['bold', 'italic', 'link', 'heading-three', 'bulleted-list', 'numbered-list', 'quote'],
  editor_components: [],
});

const image = (name: string, label: string, hint?: string): CmsField => ({
  name,
  label,
  widget: 'image',
  required: false,
  hint,
  i18n: 'duplicate',
  choose_url: false,
});

const altText = (name = 'alt'): CmsField =>
  text(
    name,
    'Image description (alt text)',
    'Describe what the image shows for people who cannot see it, e.g. "Map of the Ring of Fire". Leave empty only if the image is purely decorative.',
  );

const toggle = (name: string, label: string, hint?: string): CmsField => ({
  name,
  label,
  widget: 'boolean',
  required: false,
  default: false,
  hint,
  i18n: 'duplicate',
});

/* ── Section building blocks (add, remove and reorder per section) ─────────── */

const BLOCK_TYPES: CmsField[] = [
  {
    name: 'text',
    label: 'Text',
    widget: 'object',
    summary: '{{fields.body | truncate(60)}}',
    fields: [richText('body', 'Text', 'Use the toolbar for bold text, lists, headings and links.')],
  },
  {
    name: 'image',
    label: 'Image',
    widget: 'object',
    summary: '{{fields.caption}}',
    fields: [
      image('image', 'Image', 'Large photos are made smaller automatically.'),
      altText(),
      text('caption', 'Caption (optional)', 'Shown under the image, e.g. the source.'),
      toggle('round', 'Show as a circle'),
    ],
  },
  {
    name: 'video',
    label: 'Video (YouTube or Vimeo)',
    widget: 'object',
    summary: '{{fields.title}}',
    fields: [
      {
        name: 'url',
        label: 'Video link',
        widget: 'string',
        required: true,
        i18n: true,
        hint: 'Upload the video to YouTube or Vimeo first, then paste its link here, e.g. https://www.youtube.com/watch?v=… You can use a different video for Indonesian.',
      },
      text('title', 'Video title', 'Short description of the video, read out by screen readers.', true),
      text('caption', 'Caption (optional)'),
    ],
  },
  {
    name: 'imageText',
    label: 'Image + text side by side',
    widget: 'object',
    summary: '{{fields.body | truncate(60)}}',
    fields: [
      image('image', 'Image'),
      altText(),
      text('caption', 'Caption (optional)'),
      richText('body', 'Text'),
      {
        name: 'imagePosition',
        label: 'Image position',
        widget: 'select',
        options: [
          { label: 'Image on the left', value: 'left' },
          { label: 'Image on the right', value: 'right' },
        ],
        default: 'left',
        i18n: 'duplicate',
      },
    ],
  },
  {
    name: 'circles',
    label: 'Row of round images',
    widget: 'object',
    fields: [
      {
        name: 'items',
        label: 'Circles',
        label_singular: 'circle',
        widget: 'list',
        default: [],
        i18n: true,
        summary: '{{fields.label}}',
        hint: 'Two to four circles fit in one row. A circle without an image shows as grey.',
        fields: [text('label', 'Label'), image('image', 'Image (optional)'), altText(), longText('text', 'Text under the circle (optional)')],
      },
    ],
  },
  {
    name: 'tiles',
    label: 'Boxes with a title and text',
    widget: 'object',
    fields: [
      {
        name: 'items',
        label: 'Boxes',
        label_singular: 'box',
        widget: 'list',
        default: [],
        i18n: true,
        summary: '{{fields.title}}',
        fields: [
          text('title', 'Title'),
          longText('text', 'Text (optional)'),
          text('linkLabel', 'Button text (optional)', 'Only shown when a button link is filled in.'),
          {
            name: 'linkUrl',
            label: 'Button link (optional)',
            widget: 'string',
            required: false,
            i18n: true,
            hint: 'A full web address, e.g. https://climateactiontracker.org/',
          },
        ],
      },
    ],
  },
  {
    name: 'chip',
    label: 'Small grey label',
    widget: 'object',
    summary: '{{fields.label}}',
    fields: [text('label', 'Label')],
  },
  {
    name: 'placeholder',
    label: 'Placeholder (grey box)',
    widget: 'object',
    summary: '{{fields.label}}',
    fields: [
      text('label', 'Text in the box', 'e.g. "Image to be added". Replace this block once the real content exists.'),
      {
        name: 'ratio',
        label: 'Shape (width / height)',
        widget: 'string',
        required: false,
        i18n: 'duplicate',
        hint: 'e.g. 16 / 9 or 4 / 3. Leave empty for 4 / 3.',
      },
    ],
  },
];

const blocks = (name: string, label: string, hint?: string): CmsField => ({
  name,
  label,
  label_singular: 'block',
  widget: 'list',
        default: [],
  required: false,
  i18n: true,
  hint,
  types: BLOCK_TYPES as never,
});

/* ── Collections ───────────────────────────────────────────────────────────── */

const themes: CmsCollection = {
  name: 'themes',
  label: 'Themes',
  label_singular: 'Theme',
  description: 'The four learning themes. Each theme page is built from sections, and each section from blocks.',
  folder: 'content/themes',
  extension: 'json',
  format: 'json',
  create: true,
  slug: '{{title}}',
  identifier_field: 'title',
  summary: '{{number}}. {{title}}',
  sortable_fields: [{ field: 'number', default_sort: true }, 'title'],
  preview_path: 'themes/{{slug}}',
  i18n: true,
  fields: [
    {
      name: 'number',
      label: 'Theme number',
      widget: 'number',
      value_type: 'int',
      min: 1,
      hint: 'Sets the order of the themes (1, 2, 3, 4).',
      i18n: 'duplicate',
    } as CmsField,
    text('title', 'Title', undefined, true),
    longText('subtitle', 'Short introduction', 'Shown on the photo at the top of the page.'),
    image('heroImage', 'Top photo', 'Wide landscape photos work best.'),
    image('cardImage', 'Photo on the home page card', 'Portrait (tall) photos work best.'),
    longText('cardText', 'Text on the home page card'),
    {
      name: 'testResource',
      label: '"Test your knowledge" links to',
      widget: 'relation',
      collection: 'resources',
      value_field: '{{slug}}',
      search_fields: ['title'],
      display_fields: ['title'],
      required: false,
      i18n: 'duplicate',
      hint: 'Pick this theme’s test. Leave empty to link to all tests of this theme.',
    } as CmsField,
    {
      name: 'subCards',
      label: 'Three cards under the top photo',
      label_singular: 'card',
      widget: 'list',
        default: [],
      required: false,
      i18n: true,
      max: 3,
      summary: '{{fields.title}}',
      fields: [
        text('title', 'Title'),
        longText('text', 'Text'),
        {
          name: 'link',
          label: 'Link',
          widget: 'string',
          required: false,
          i18n: true,
          hint: 'A page on this site (e.g. /resources/lesson-plan-climate), a section on this page (e.g. #different-climates) or a full web address.',
        },
        image('image', 'Photo (optional)'),
        toggle('climateClass', 'Show the "Climate Class" logo on the photo'),
      ],
    },
    {
      name: 'sections',
      label: 'Sections',
      label_singular: 'section',
      widget: 'list',
        default: [],
      required: false,
      i18n: true,
      collapsed: true,
      summary: '{{fields.title}}',
      hint: 'Sections appear in this order and are listed in the "On this page" menu. Drag to reorder.',
      fields: [
        text('title', 'Section title'),
        text('navLabel', 'Shorter name for the "On this page" menu (optional)'),
        {
          name: 'id',
          label: 'Link name (optional)',
          widget: 'string',
          required: false,
          i18n: 'duplicate',
          hint: 'Used in links to this section, e.g. "ring-of-fire" for #ring-of-fire. Leave empty to make one from the title. Changing it breaks existing links.',
        },
        {
          name: 'layout',
          label: 'Layout',
          widget: 'select',
          options: [
            { label: 'Everything stacked, full width', value: 'stack' },
            { label: 'Two columns: main blocks left, side blocks right', value: 'split' },
          ],
          default: 'stack',
          i18n: 'duplicate',
        },
        {
          name: 'align',
          label: 'Title alignment',
          widget: 'select',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Centre', value: 'center' },
            { label: 'Right', value: 'right' },
          ],
          default: 'left',
          i18n: 'duplicate',
        },
        blocks('blocks', 'Main blocks', 'Add text, images, videos and more.'),
        blocks('aside', 'Side blocks', 'Only used with the two-column layout; shown on the right (below on phones).'),
      ],
    },
  ] as CmsField[],
};

const resources: CmsCollection = {
  name: 'resources',
  label: 'Resources',
  label_singular: 'Resource',
  description: 'Lesson plans, tests, extra resources and module downloads in the resource library.',
  folder: 'content/resources',
  extension: 'json',
  format: 'json',
  create: true,
  slug: '{{title}}',
  identifier_field: 'title',
  summary: '{{title}}',
  sortable_fields: [{ field: 'order', default_sort: true }, 'title'],
  view_groups: [
    { label: 'Type', field: 'type' },
    { label: 'Theme', field: 'theme' },
  ],
  preview_path: 'resources/{{slug}}',
  i18n: true,
  fields: [
    text('title', 'Title', undefined, true),
    longText('description', 'Short description', 'Shown on the resource card.'),
    {
      name: 'type',
      label: 'Type',
      widget: 'select',
      options: [
        { label: 'Lesson plan', value: 'lesson-plan' },
        { label: 'Test your knowledge', value: 'test' },
        { label: 'Extra resource', value: 'extra' },
        { label: 'Module download', value: 'module' },
      ],
      i18n: 'duplicate',
    },
    {
      name: 'theme',
      label: 'Theme',
      widget: 'relation',
      collection: 'themes',
      value_field: '{{slug}}',
      search_fields: ['title'],
      display_fields: ['title'],
      i18n: 'duplicate',
    } as CmsField,
    toggle('forTeachers', 'Meant for teachers', 'Adds the "For teachers" tag and filter.'),
    {
      name: 'order',
      label: 'Position in the list',
      widget: 'number',
      value_type: 'int',
      required: false,
      hint: 'Lower numbers come first. The first six appear on the home page.',
      i18n: 'duplicate',
    } as CmsField,
    image('image', 'Photo (optional)'),
    richText('goal', 'Goal', 'Lesson plans only.'),
    richText('objectives', 'Learning objectives', 'Lesson plans only.'),
    {
      name: 'steps',
      label: 'Lesson steps',
      label_singular: 'step',
      widget: 'list',
        default: [],
      required: false,
      i18n: true,
      hint: 'Lesson plans only. Each step is shown as its own box.',
      summary: '{{fields.body | truncate(50)}}',
      fields: [richText('body', 'Step')],
    },
    {
      name: 'file',
      label: 'Download file (PDF)',
      widget: 'file',
      required: false,
      i18n: true,
      media_folder: '/public/downloads',
      public_folder: '/downloads',
      hint: 'The file behind the "Download" button. You can upload a different file for Indonesian.',
    } as CmsField,
    text(
      'teacherFile',
      'Teacher-only file (path in Supabase)',
      'Only verified teachers can download it. Upload the file in Supabase (Storage → teacher-files) and paste its path here, e.g. "climate/lesson-1-answers.pdf". See docs/CMS.md. Not shown in this preview.',
    ),
    {
      name: 'questions',
      label: 'Test questions',
      label_singular: 'question',
      widget: 'list',
        default: [],
      required: false,
      i18n: true,
      collapsed: true,
      summary: '{{fields.question}}',
      hint: 'Tests only. Tick "Correct answer" on the right options; scoring switches on once every question has one.',
      fields: [
        text('question', 'Question'),
        toggle('multiple', 'More than one answer can be correct ("check all that apply")'),
        image('image', 'Image next to the question (optional)'),
        altText(),
        {
          name: 'options',
          label: 'Answer options',
          label_singular: 'option',
          widget: 'list',
        default: [],
          i18n: true,
          summary: '{{fields.text}}',
          fields: [text('text', 'Answer'), toggle('correct', 'Correct answer')],
        },
      ],
    },
  ] as CmsField[],
};

const pages: CmsCollection = {
  name: 'pages',
  label: 'Pages',
  description: 'The home page, Our mission and the legal pages.',
  i18n: true,
  files: [
    {
      name: 'home',
      label: 'Home page',
      file: 'content/pages/home.json',
      preview_path: '',
      i18n: true,
      fields: [
        text('heroTitleLine1', 'Big title, line 1'),
        text('heroTitleLine2', 'Big title, line 2'),
        longText('heroIntro', 'Introduction under the title'),
        image('heroImage', 'Top photo', 'Shown faded behind the title.'),
        text('themesTitle', '"Themes" heading'),
        longText('themesIntro', 'Text under "Themes"'),
        text('howItWorksTitle', '"How it works" heading'),
        richText('howItWorks', '"How it works" text'),
        text('lessonsTitle', '"Lesson plans" heading', 'The six cards below it are the first six resources.'),
        richText('quote', 'Quote', 'Use bold for the part to emphasise.'),
        text('quoteAttribution', 'Who said it'),
        text('collaborationTitle', '"Collaboration" heading'),
        {
          name: 'partners',
          label: 'Partners',
          label_singular: 'partner',
          widget: 'list',
        default: [],
          required: false,
          i18n: true,
          summary: '{{fields.name}}',
          fields: [
            text('name', 'Name'),
            image('logo', 'Logo (optional)'),
            {
              name: 'url',
              label: 'Website (optional)',
              widget: 'string',
              required: false,
              i18n: 'duplicate',
            },
          ],
        },
      ] as CmsField[],
    },
    {
      name: 'mission',
      label: 'Our mission',
      file: 'content/pages/mission.json',
      preview_path: 'mission',
      i18n: true,
      fields: [
        text('title', 'Page title'),
        longText('intro', 'Introduction'),
        {
          name: 'sections',
          label: 'Sections',
          label_singular: 'section',
          widget: 'list',
        default: [],
          required: false,
          i18n: true,
          collapsed: true,
          summary: '{{fields.title}}',
          hint: 'The menu links to: mission, our-product, the-team, our-impact, collaboration, future-plans, contact. Keep those link names.',
          fields: [
            text('title', 'Section title'),
            {
              name: 'id',
              label: 'Link name (optional)',
              widget: 'string',
              required: false,
              i18n: 'duplicate',
              hint: 'e.g. "the-team". Leave empty to make one from the title.',
            },
            blocks('blocks', 'Blocks'),
          ],
        },
      ] as CmsField[],
    },
    {
      name: 'privacy',
      label: 'Privacy',
      file: 'content/pages/privacy.json',
      preview_path: 'privacy',
      i18n: true,
      fields: [text('title', 'Page title'), richText('body', 'Text')],
    },
    {
      name: 'terms',
      label: 'Terms of use',
      file: 'content/pages/terms.json',
      preview_path: 'terms',
      i18n: true,
      fields: [text('title', 'Page title'), richText('body', 'Text')],
    },
  ],
};

const settings: CmsCollection = {
  name: 'settings',
  label: 'Site settings',
  i18n: true,
  editor: { preview: false },
  files: [
    {
      name: 'site',
      label: 'Footer and general',
      file: 'content/settings/site.json',
      i18n: true,
      fields: [
        longText('tagline', 'Footer tagline'),
        { name: 'organisation', label: 'Organisation name', widget: 'string', i18n: 'duplicate' },
      ] as CmsField[],
    },
  ],
};

/* ── Config ────────────────────────────────────────────────────────────────── */

export const cmsConfig: CmsConfig = {
  load_config_file: false,
  backend: {
    name: 'github',
    repo: CMS_REPO,
    branch: CMS_BRANCH,
    base_url: CMS_AUTH_URL,
    commit_messages: {
      create: 'CMS: create {{collection}} “{{slug}}”',
      update: 'CMS: update {{collection}} “{{slug}}”',
      delete: 'CMS: delete {{collection}} “{{slug}}”',
      uploadMedia: 'CMS: upload “{{path}}”',
      deleteMedia: 'CMS: delete “{{path}}”',
    },
  },
  // On localhost with `npm run cms` running, edits are saved straight to this folder.
  local_backend: true,
  // Drafts → In review → Ready → Publish (nothing goes live by accident).
  publish_mode: 'editorial_workflow',
  site_url: SITE_URL,
  display_url: SITE_URL,
  show_preview_links: true,
  media_folder: 'public/uploads',
  public_folder: '/uploads',
  // Resize large photos and convert them to WebP in the browser before uploading.
  media_processing: {
    enabled: true,
    format: { enabled: true, default: 'webp' },
    quality: 80,
    width: 2400,
    strip_metadata: true,
  },
  slug: { encoding: 'ascii', clean_accents: true, sanitize_replacement: '-' },
  i18n: { structure: 'single_file', locales: ['en', 'id'], default_locale: 'en' },
  editor: { preview: true },
  collections: [themes, resources, pages, settings],
};
