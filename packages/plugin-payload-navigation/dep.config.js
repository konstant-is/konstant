// eslint-disable-next-line import/no-anonymous-default-export
export default {
  // These must be provided by the consuming project
  peer: ['payload', '@payloadcms/plugin-nested-docs', '@payloadcms/ui'],

  // These are bundled with your library and needed at runtime
  runtime: ['slugify'],
}
