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

/* ── Shared field groups ───────────────────────────────────────────────────── */

type Option = { label: string; value: string };

const select = (name: string, label: string, options: Option[], def: string, hint?: string): CmsField => ({
  name,
  label,
  widget: 'select',
  options,
  default: def,
  required: false,
  hint,
  i18n: 'duplicate',
});

const link = (name: string, label: string, hint?: string): CmsField => ({
  name,
  label,
  widget: 'string',
  required: false,
  i18n: true,
  hint: hint ?? 'A page on this site (e.g. /resources/ring-of-fire), a section (e.g. #ring-of-fire) or a full web address.',
});

const list = (name: string, label: string, singular: string, fields: CmsField[], summary: string, hint?: string): CmsField => ({
  name,
  label,
  label_singular: singular,
  widget: 'list',
  default: [],
  required: false,
  i18n: true,
  summary,
  hint,
  fields,
});

/** A list of plain lines, e.g. learning goals. */
const lines = (name: string, label: string, hint?: string): CmsField => ({
  name,
  label,
  widget: 'list',
  default: [],
  required: false,
  i18n: true,
  hint,
});

/** A group of fields that belongs to one part of a page. */
const group = (name: string, label: string, fields: CmsField[], hint?: string): CmsField => ({
  name,
  label,
  widget: 'object',
  collapsed: true,
  required: false,
  i18n: true,
  hint,
  fields,
});

const titleText = (): CmsField[] => [text('title', 'Title'), longText('text', 'Text')];

const BACKGROUNDS: Option[] = [
  { label: 'Page (very light)', value: 'page' },
  { label: 'Sky (light blue)', value: 'sky' },
  { label: 'Sun (yellow, Theme 1)', value: 'sun' },
  { label: 'Ember (orange, Theme 2)', value: 'ember' },
  { label: 'Leaf (green, Theme 3)', value: 'leaf' },
  { label: 'Lagoon (teal, Theme 4)', value: 'lagoon' },
];

const NUMBER_STYLES: Option[] = [
  { label: 'Quiet (light blue)', value: 'quiet' },
  { label: 'White', value: 'white' },
  { label: 'Blue', value: 'blue' },
  { label: 'Sun (yellow)', value: 'sun' },
  { label: 'Ember (orange): a warning', value: 'ember' },
  { label: 'Leaf (green)', value: 'leaf' },
  { label: 'Lagoon (teal): a solution', value: 'lagoon' },
];

const bigNumberFields = (): CmsField[] => [
  text('value', 'Number', 'e.g. 426 or 1.55 or 150+'),
  text('caption', 'What it means', 'At most 12 words, no sentences.'),
  select('style', 'Colour', NUMBER_STYLES, 'quiet'),
];

/* ── Section building blocks (DESIGN.md §6.2) ──────────────────────────────── */

const BLOCK_TYPES: CmsField[] = [
  {
    name: 'text',
    label: 'Text',
    widget: 'object',
    summary: '{{fields.body | truncate(60)}}',
    fields: [richText('body', 'Text', 'Use the toolbar for bold text, lists and links.')],
  },
  {
    name: 'image',
    label: 'Image',
    widget: 'object',
    summary: '{{fields.alt}}',
    fields: [
      image('image', 'Image', 'Large photos are made smaller automatically.'),
      altText(),
      select(
        'shape',
        'Shape',
        [
          { label: 'Rounded corners', value: 'rounded' },
          { label: 'Arch (round top)', value: 'arch' },
          { label: 'Circle', value: 'circle' },
          { label: 'Oval', value: 'oval' },
        ],
        'rounded',
      ),
      select(
        'size',
        'Size',
        [
          { label: 'Its own size (at most the column)', value: '' },
          { label: 'Column width', value: 'full' },
          { label: 'Medium (307 px)', value: 'medium' },
          { label: 'Small (220 px)', value: 'small' },
        ],
        '',
        'Circles are small unless you choose otherwise; other images keep their own size.',
      ),
      text('source', 'Source (optional)', 'Shown under the image as "Source: …", e.g. "NOAA; WMO; NASA".'),
    ],
  },
  {
    name: 'callout',
    label: 'Callout (tip, fact or question)',
    widget: 'object',
    summary: '{{fields.kind}}: {{fields.body | truncate(40)}}',
    fields: [
      select(
        'kind',
        'Kind',
        [
          { label: 'Teacher tip (light blue)', value: 'teacher-tip' },
          { label: 'Did you know? (yellow)', value: 'did-you-know' },
          { label: 'Talk about it (green)', value: 'talk-about-it' },
          { label: 'Ask your class (light blue)', value: 'ask-your-class' },
          { label: 'Go deeper (white, with a title)', value: 'go-deeper' },
        ],
        'teacher-tip',
        'Keep it under 30 words, and at most two callouts per screen.',
      ),
      text('label', 'Label (optional)', 'Replaces the standard label, e.g. "So".'),
      text('title', 'Title (optional)', 'Used by "Go deeper".'),
      richText('body', 'Text', 'Bold text and links are allowed.'),
    ],
  },
  {
    name: 'bigNumbers',
    label: 'Big numbers (circles)',
    widget: 'object',
    fields: [list('items', 'Numbers', 'number', bigNumberFields(), '{{fields.value}} {{fields.caption}}', 'Two to four in a row.')],
  },
  {
    name: 'numberedCards',
    label: 'Numbered cards (1, 2, 3 …)',
    widget: 'object',
    fields: [list('items', 'Cards', 'card', titleText(), '{{fields.title}}', 'Three to five steps, e.g. "Why it happens".')],
  },
  {
    name: 'infoCards',
    label: 'Cards with a title and text',
    widget: 'object',
    fields: [
      {
        name: 'columns',
        label: 'Cards per row',
        widget: 'number',
        value_type: 'int',
        min: 1,
        max: 5,
        default: 3,
        required: false,
        i18n: 'duplicate',
      } as CmsField,
      list(
        'items',
        'Cards',
        'card',
        [
          ...titleText(),
          select(
            'dot',
            'Coloured dot before the title (optional)',
            [
              { label: 'None', value: '' },
              { label: 'Red', value: 'red' },
              { label: 'Orange', value: 'orange' },
              { label: 'Yellow', value: 'sun' },
              { label: 'Green', value: 'leaf' },
              { label: 'Teal', value: 'lagoon' },
              { label: 'Blue', value: 'blue' },
              { label: 'Dark', value: 'ink' },
            ],
            '',
          ),
          select(
            'background',
            'Card colour',
            [{ label: 'White', value: 'white' }, ...BACKGROUNDS.filter((b) => b.value !== 'page')],
            'white',
          ),
          image('image', 'Image (optional)'),
          altText(),
        ],
        '{{fields.title}}',
      ),
    ],
  },
  {
    name: 'quote',
    label: 'Quote',
    widget: 'object',
    summary: '{{fields.attribution}}',
    fields: [
      richText('quote', 'Quote', 'Use bold for the part to emphasise.'),
      text('attribution', 'Who said it'),
      image('image', 'Round photo (optional)'),
      altText(),
    ],
  },
  {
    name: 'links',
    label: 'Buttons',
    widget: 'object',
    fields: [
      list(
        'items',
        'Buttons',
        'button',
        [
          text('label', 'Button text'),
          link('url', 'Link'),
          select(
            'style',
            'Style',
            [
              { label: 'Filled (the main action)', value: 'primary' },
              { label: 'Outline', value: 'secondary' },
            ],
            'secondary',
          ),
        ],
        '{{fields.label}}',
      ),
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
        hint: 'Upload the video to YouTube or Vimeo first, then paste its link here. You can use a different video for Indonesian.',
      },
      text('title', 'Video title', 'Short description of the video, read out by screen readers.', true),
      text('caption', 'Caption (optional)'),
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

const sectionFields = (): CmsField[] => [
  text('title', 'Section title'),
  text('navLabel', 'Shorter name for the "On this page" chips (optional)'),
  {
    name: 'id',
    label: 'Link name (optional)',
    widget: 'string',
    required: false,
    i18n: 'duplicate',
    hint: 'Used in links to this section, e.g. "ring-of-fire" for #ring-of-fire. Leave empty to make one from the title. Changing it breaks existing links.',
  },
  longText('intro', 'Text under the title (optional)'),
  select('background', 'Background colour', BACKGROUNDS, 'page'),
  select(
    'layout',
    'Layout',
    [
      { label: 'Everything stacked, full width', value: 'stack' },
      { label: 'Two columns: main blocks left, side blocks right', value: 'split' },
      { label: 'Two columns, with the title in the left column', value: 'split-title' },
      { label: 'Two columns, the left one twice as wide', value: 'split-wide' },
    ],
    'stack',
  ),
  toggle(
    'joinPrevious',
    'Continue the section above',
    'No title and no gap: use it for a part with another layout, e.g. two columns under a full-width map.',
  ),
  blocks('blocks', 'Main blocks', 'Add text, images, callouts, numbers, cards and more.'),
  blocks('aside', 'Side blocks', 'Only used with the two-column layout; shown on the right (below on phones).'),
];

/* ── Collections ───────────────────────────────────────────────────────────── */

// The themes and their tests as fixed choices. Decap's "relation" widget would look them up,
// but it marks a page as changed as soon as it opens, so Decap then asks "leave this page?"
// on every click away. A fifth theme needs a developer anyway (colours, DESIGN.md).
const THEMES: Option[] = [
  { label: 'Theme 1: Climate', value: 'climate' },
  { label: 'Theme 2: Climate Change', value: 'climate-change' },
  { label: 'Theme 3: Human and Nature', value: 'human-and-nature' },
  { label: 'Theme 4: Solutions', value: 'solutions' },
];

const themes: CmsCollection = {
  name: 'themes',
  label: 'Themes',
  label_singular: 'Theme',
  description:
    'The four theme pages. Each page is built from sections, and each section from blocks. The "Hard words" at the bottom of each theme also fill the Glossary page.',
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
      max: 4,
      hint: 'Sets the order and the colour: 1 yellow, 2 orange, 3 green, 4 teal.',
      i18n: 'duplicate',
    } as CmsField,
    text('title', 'Title', undefined, true),
    longText('lead', 'First paragraph at the top', 'Slightly larger text under the title.'),
    longText('intro', 'Second paragraph at the top'),
    image('heroImage', 'Top photo', 'Shown as an arch. Portrait (tall) photos work best.'),
    altText('heroAlt'),
    image('cardImage', 'Photo on the home page card', 'Shown as a circle.'),
    longText('cardText', 'Text on the home page card', 'One short line.'),
    list(
      'introCards',
      'Three cards under the top',
      'card',
      [
        select(
          'kind',
          'Kind',
          [
            { label: 'Explanation', value: 'explanation' },
            { label: 'Lesson module', value: 'module' },
            { label: 'News article', value: 'news' },
          ],
          'explanation',
        ),
        text('title', 'Title'),
        longText('text', 'Text (optional)'),
        link('link', 'Link'),
        image('image', 'Image'),
        altText(),
      ],
      '{{fields.title}}',
    ),
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
      hint: 'Sections appear in this order and are listed in the "On this page" chips. Drag to reorder.',
      fields: sectionFields(),
    },
    list(
      'glossary',
      'Hard words, simple meanings',
      'word',
      [text('term', 'Word'), longText('meaning', 'Simple meaning')],
      '{{fields.term}}',
      'Shown near the end of the theme page and on the Glossary page.',
    ),
    {
      name: 'testResource',
      label: '"Test your knowledge" links to',
      widget: 'select',
      options: THEMES.map((t) => ({ label: `Test of ${t.label}`, value: `test-${t.value}` })),
      required: false,
      i18n: 'duplicate',
      hint: 'Pick this theme’s test.',
    } as CmsField,
    {
      name: 'pdf',
      label: 'This theme as a PDF',
      widget: 'file',
      required: false,
      i18n: true,
      media_folder: '/public/downloads',
      public_folder: '/downloads',
    } as CmsField,
    image('pdfImage', 'PDF thumbnail', 'Small photo next to the PDF link. Leave empty to use the hero photo.'),
  ] as CmsField[],
};

// The resource library is one folder (content/resources), shown in the menu as four
// collections, one per type, so each only asks for the fields its type uses. The hidden
// `type` field gives new entries the right type.

export type ResourceType = 'lesson-plan' | 'test' | 'for-teachers' | 'extra';

/** Collection name in the editor for each resource type (used by search.tsx too). */
export const RESOURCE_COLLECTIONS: Record<ResourceType, string> = {
  'lesson-plan': 'lesson-plans',
  test: 'tests',
  'for-teachers': 'teacher-material',
  extra: 'extra-resources',
};

const resourceBase = (type: ResourceType): CmsField[] => [
  text('title', 'Title', 'Shown on the card and at the top of the page.', true),
  { name: 'type', label: 'Type', widget: 'hidden', default: type, i18n: 'duplicate' } as CmsField,
  select('theme', 'Theme', THEMES, 'climate', 'Sets the colour at the top of the page and the theme filter in the resource library.'),
  longText('description', 'One line on the card'),
];

const order = (): CmsField =>
  ({
    name: 'order',
    label: 'Position in the list',
    widget: 'number',
    value_type: 'int',
    required: false,
    hint: 'Lower numbers come first in the resource library.',
    i18n: 'duplicate',
  }) as CmsField;

const downloadFile = (): CmsField =>
  ({
    name: 'file',
    label: 'Download file (PDF)',
    widget: 'file',
    required: false,
    i18n: true,
    media_folder: '/public/downloads',
    public_folder: '/downloads',
    hint: 'The file behind the "Download" button. You can upload a different file for Indonesian.',
  }) as CmsField;

const teacherFile = (): CmsField =>
  text(
    'teacherFile',
    'Teacher-only file (path in Supabase, optional)',
    'Only verified teachers can download it. Upload the file in Supabase (Storage → teacher-files) and paste its path here, e.g. "climate/lesson-1-answers.pdf". See docs/CMS.md. Not shown in this preview.',
  );

function resourceCollection(
  type: ResourceType,
  label: string,
  singular: string,
  description: string,
  fields: CmsField[],
): CmsCollection {
  return {
    name: RESOURCE_COLLECTIONS[type],
    label,
    label_singular: singular,
    description,
    folder: 'content/resources',
    extension: 'json',
    format: 'json',
    filter: { field: 'type', value: type },
    create: true,
    slug: '{{title}}',
    identifier_field: 'title',
    summary: '{{title}}',
    sortable_fields: [{ field: 'order', default_sort: true }, 'title'],
    view_filters: THEMES.map((t) => ({ label: t.label, field: 'theme', pattern: `^${t.value}$` })),
    preview_path: 'resources/{{slug}}',
    i18n: true,
    fields: [...resourceBase(type), ...fields],
  } as CmsCollection;
}

const lessonPlans = resourceCollection(
  'lesson-plan',
  'Lesson plans',
  'Lesson plan',
  'Ready-to-teach lessons, with goals, materials and steps. Tick "Show on the home page" for the lesson plans on the home page.',
  [
    image('image', 'Image', 'Shown on the card and as an arch at the top of the lesson plan.'),
    altText(),
    text('grade', 'Grade (optional)', 'e.g. "Grade 3–4" or "All grades".'),
    text('duration', 'Duration (optional)', 'e.g. "45 min".'),
    order(),
    toggle('featured', 'Show in "Lesson plans" on the home page'),
    text('author', 'Author'),
    longText('about', 'About this lesson'),
    lines('goals', 'Students learn to', 'One goal per line.'),
    richText('context', 'Lesson context'),
    list('materials', 'Materials', 'material', titleText(), '{{fields.title}}'),
    list(
      'steps',
      'Lesson steps',
      'step',
      [text('title', 'Step title'), richText('text', 'What to do')],
      '{{fields.title}}',
    ),
    longText('keyMessage', 'Key message'),
    longText('teacherTip', 'Teacher tip'),
    list('photos', 'Photos', 'photo', [image('image', 'Photo'), altText()], '{{fields.alt}}', 'Three fit in a row.'),
    downloadFile(),
    teacherFile(),
  ],
);

const tests = resourceCollection(
  'test',
  'Tests',
  'Test',
  'The "Test your knowledge" quiz of each theme: questions, answer options and explanations.',
  [
    image('image', 'Image (optional)', 'Shown on the card in the resource library.'),
    altText(),
    text('duration', 'Duration (optional)', 'e.g. "10 min".'),
    order(),
    longText('intro', 'Introduction', 'One line above the questions.'),
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
      hint: 'Tick "Correct answer" on the right options; scoring switches on once every question has one.',
      fields: [
        text('question', 'Question'),
        toggle('multiple', 'More than one answer can be correct ("check all that apply")'),
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
        longText('explanation', 'Explanation', 'Shown on the result, under the correct answer.'),
        image('image', 'Image next to the question (optional)'),
        altText(),
      ],
    } as CmsField,
    teacherFile(),
  ],
);

const teacherMaterial = resourceCollection(
  'for-teachers',
  'Teacher material',
  'Teacher material',
  'Lesson modules and guides for teachers, usually a PDF to download.',
  [
    image('image', 'Image (optional)', 'Shown on the card.'),
    altText(),
    text('duration', 'Duration (optional)', 'e.g. "30 min".'),
    order(),
    downloadFile(),
    teacherFile(),
  ],
);

const extraResources = resourceCollection(
  'extra',
  'Extra resources',
  'Extra resource',
  'Links to other websites, videos and documents that are useful for a theme.',
  [
    image('image', 'Image (optional)', 'Shown on the card.'),
    altText(),
    order(),
    link('link', 'Link', 'A full web address, e.g. https://www.bmkg.go.id, or a page of this site, e.g. /glossary.'),
    downloadFile(),
  ],
);

const pages: CmsCollection = {
  name: 'pages',
  label: 'Other pages',
  label_singular: 'Page',
  description: 'The home page, Our mission, the top of the Glossary page, and the privacy and terms pages.',
  i18n: true,
  files: [
    {
      name: 'home',
      label: 'Home page',
      file: 'content/pages/home.json',
      preview_path: '',
      i18n: true,
      fields: [
        group('hero', 'Top', [
          text('title', 'Big title'),
          longText('intro', 'Introduction'),
          text('buttonLabel', 'Button text', 'The button opens the lesson plans.'),
          image('image', 'Photo', 'Shown as an arch.'),
          altText(),
        ]),
        group('themes', 'Themes', [text('title', 'Heading'), longText('intro', 'Text')], 'The four theme cards come from the themes.'),
        group('numbers', 'Climate change in numbers', [
          text('title', 'Heading'),
          longText('intro', 'Text'),
          list('items', 'Numbers', 'number', bigNumberFields(), '{{fields.value}}'),
          text('asideTitle', 'Side heading'),
          longText('asideText', 'Side text', 'The button under it opens Theme 4.'),
          longText('tip', 'Teacher tip'),
        ]),
        group('lombok', 'From Lombok to the world', [
          text('label', 'Small label'),
          text('title', 'Heading'),
          longText('body', 'Text'),
          longText('callout', '"Did you know?" text'),
          image('image', 'Round photo'),
          altText(),
        ]),
        group('howItWorks', 'How it works', [
          text('title', 'Heading'),
          longText('intro', 'Text'),
          lines('steps', 'Steps', 'One step per line; numbered automatically.'),
          longText('tip', 'Teacher tip'),
        ]),
        group(
          'lessons',
          'Lesson plans',
          [text('title', 'Heading'), longText('intro', 'Text')],
          'The cards are the resources marked "Show in Lesson plans on the home page".',
        ),
        group('quote', 'Quote', [
          richText('quote', 'Quote', 'Use bold for the part to emphasise.'),
          text('attribution', 'Who said it'),
          image('image', 'Round photo'),
          altText(),
        ]),
        group('ready', 'Ready to teach?', [text('title', 'Heading'), longText('body', 'Text')]),
        group('collaboration', 'Collaboration', [
          text('title', 'Heading'),
          longText('body', 'Text'),
          image('logo', 'Partner logo'),
          altText('logoAlt'),
          link('url', 'Partner website (optional)'),
        ]),
      ] as CmsField[],
    },
    {
      name: 'mission',
      label: 'Our mission',
      file: 'content/pages/mission.json',
      preview_path: 'mission',
      i18n: true,
      fields: [
        group('hero', 'Top', [
          text('label', 'Small label'),
          text('title', 'Title'),
          longText('lead', 'First paragraph'),
          longText('intro', 'Second paragraph'),
          image('image', 'Photo', 'Shown as an arch.'),
          altText(),
        ]),
        group('product', 'Our product', [
          text('title', 'Heading'),
          longText('lead', 'Text'),
          list('offers', 'What we offer', 'offer', titleText(), '{{fields.title}}'),
          image('image', 'Image'),
          altText(),
        ]),
        group('team', 'The team', [
          text('title', 'Heading'),
          longText('intro', 'Text'),
          image('logo', 'Logo', 'Shown next to the heading, e.g. the TU Delft logo.'),
          altText('logoAlt'),
          image('image', 'Group photo'),
          altText(),
          list(
            'people',
            'People',
            'person',
            [text('name', 'Name'), text('role', 'Role'), text('study', 'Study'), image('photo', 'Photo', 'Shown as a circle.')],
            '{{fields.name}}',
          ),
        ]),
        group('impact', 'Our impact', [
          text('title', 'Heading'),
          longText('intro', 'Text'),
          list('numbers', 'Numbers', 'number', bigNumberFields(), '{{fields.value}}'),
          list('cards', 'Cards', 'card', titleText(), '{{fields.title}}'),
        ]),
        group('ibf', 'Collaboration with IBF', [
          text('title', 'Heading'),
          longText('body', 'Text'),
          text('linkLabel', 'Button text'),
          link('url', 'Button link'),
          image('logo', 'Logo'),
        ]),
        group('plans', 'Future plans', [text('title', 'Heading'), list('items', 'Plans', 'plan', titleText(), '{{fields.title}}')]),
        group('workshop', 'Next workshop', [
          text('title', 'Heading'),
          longText('body', 'Text'),
          text('buttonLabel', 'Button text'),
          link('url', 'Button link'),
        ]),
        group('gallery', 'Photo strip', [
          list('photos', 'Photos', 'photo', [image('image', 'Photo'), altText()], '{{fields.alt}}', 'A row of photos above the contact card. Four fit best.'),
        ]),
        group('contact', 'Contact card', [
          text('title', 'Heading'),
          text('name', 'Name'),
          text('phone', 'Phone number'),
          text('email', 'E-mail address'),
          image('image', 'Photo', 'Shown as a circle.'),
          altText(),
        ]),
      ] as CmsField[],
    },
    {
      name: 'glossary',
      label: 'Glossary',
      file: 'content/pages/glossary.json',
      preview_path: 'glossary',
      i18n: true,
      fields: [
        text(
          'title',
          'Page title',
          'Only the top of the Glossary page is edited here. The words and their meanings come from the themes: open a theme and scroll to "Hard words, simple meanings".',
        ),
        text('lead', 'First line'),
        longText('intro', 'Second line'),
      ] as CmsField[],
    },
    {
      name: 'privacy',
      label: 'Privacy policy',
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
  label: 'Footer',
  description: 'The text in the footer at the bottom of every page.',
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
  collections: [themes, lessonPlans, tests, teacherMaterial, extraResources, pages, settings],
};
