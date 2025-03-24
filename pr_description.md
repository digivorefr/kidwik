Closes #6

## Description
This PR integrates the ARASAAC pictograms API to allow users to add communication pictograms to their calendars.

## Changes
- Add React Query for client-side data fetching
- Implement ARASAAC API service and components
- Create search, item display, and attribution components
- Add pictogram selection in custom sticker modal
- Implement objectFit toggle for custom image stickers
- Fix selection behavior to be consistent across sticker types
- Add proper attribution and licensing information

## Screenshots
Users can now search and add ARASAAC pictograms as stickers, with proper attribution maintained according to the license requirements.

## Testing
Tested pictogram search, selection, and display functionality.
Also ensured proper error handling for API requests.