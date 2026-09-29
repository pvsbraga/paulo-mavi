# Project architecture rules
- Shared editable lists use Lovable Cloud tables with row policies limited to the Mavi and Paulo profiles, because browser-only storage cannot synchronize their changes.
- Uploaded anniversary media is served through Lovable Assets pointers, keeping large binary files out of the source tree.
