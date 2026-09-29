# Project architecture rules
- Shared editable lists use Lovable Cloud tables with row policies limited to the Mavi and Paulo profiles, because browser-only storage cannot synchronize their changes.
- Uploaded anniversary media is served through Lovable Assets pointers, keeping large binary files out of the source tree.
- The local Vite preview proxies Lovable Assets media from the published asset host because the local development server otherwise returns its HTML fallback for CDN media paths.
