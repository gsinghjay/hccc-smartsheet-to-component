# HCCC SmartSheet to Component Generator

A web-based tool that converts Excel/SmartSheet data into a specific component format for the HCCC system. This tool provides an interactive interface for mapping data fields and generating component code in the required format.

## Project Structure

```
├── index.html              # Main HTML interface
├── styles.css             # Global styles and UI components
├── js/
│   ├── main.js           # Application entry point
│   ├── App.js            # Main application logic
│   ├── config.js         # Configuration and field mappings
│   ├── DataProcessor.js  # Data processing and transformation
│   ├── FieldMapper.js    # Field mapping and row selection
│   ├── FileHandler.js    # File upload and XLSX processing
│   └── UIRenderer.js     # UI rendering and updates
```

## Core Components

### Frontend Interface (`index.html`)
- Provides a three-step interface for file upload, field mapping, and code generation
- Integrates Bootstrap for responsive design
- Includes code preview sections with syntax highlighting
- Implements copy-to-clipboard functionality

### Styling (`styles.css`)
- Defines styles for the step progress indicator
- Implements mapping interface styles
- Provides code preview container styling
- Includes responsive design adjustments

### JavaScript Modules

#### `main.js`
- Application entry point
- Initializes the main App class
- Sets up event listeners for DOM content loaded

#### `App.js`
- Main application orchestrator
- Manages the workflow between components
- Handles state transitions between steps
- Implements component code generation
- Manages clipboard operations

#### `config.js`
- Defines field mappings between system IDs and human-readable labels
- Stores UI element IDs and configurations
- Centralizes configuration for easy updates

#### `DataProcessor.js`
- Processes raw Excel data
- Handles data transformation and validation
- Implements field value processing logic
- Manages special field processing (e.g., certifications)

#### `FieldMapper.js`
- Manages the field mapping interface
- Handles row selection functionality
- Provides data preview capabilities
- Validates mapping requirements

#### `FileHandler.js`
- Handles file upload operations
- Processes XLSX files using SheetJS
- Validates file types and formats
- Provides progress feedback

#### `UIRenderer.js`
- Manages UI updates and rendering
- Handles progress indicators
- Displays error and success messages
- Updates preview sections

## Data Flow

1. **File Upload**
   - User uploads Excel/SmartSheet file
   - FileHandler processes and validates the file
   - Data is converted to JSON format

2. **Field Mapping**
   - User maps Excel columns to required fields
   - System provides preview of mapped values
   - User can select specific rows for processing

3. **Code Generation**
   - System generates component code in format:
     ```
     ~[com[25306 1 72{"version":72,"data":{...}}]]~
     ```
   - Preview shows both JSON and component format
   - User can copy either format to clipboard

## Required Format

The system generates component code in the following format:
```
~[com[25306 1 72{"version":72,"data":{
    "field_id": "value",
    ...
}}]]~
```

## Dependencies

- **Bootstrap 5.3.2**: UI framework for responsive design
- **SheetJS (XLSX)**: Excel file processing
- **Prism.js**: Code syntax highlighting

## Usage

1. **Upload File**
   - Click "Upload File" button
   - Select Excel/SmartSheet file
   - System validates file format

2. **Map Fields**
   - Match Excel columns to required fields
   - Select specific row for processing
   - Preview mapped values

3. **Generate Code**
   - Click "Generate Code" button
   - Review generated JSON and component code
   - Copy required format to clipboard

## Development

### Setting Up
1. Clone the repository
2. Open `index.html` in a modern browser
3. No build process required (vanilla JavaScript)

### Adding New Fields
1. Update `config.js` with new field mappings
2. Add any special processing in `DataProcessor.js`
3. Update UI components if needed

### Modifying Component Format
1. Update `generateComponentCode` method in `App.js`
2. Adjust preview formatting in `UIRenderer.js`
3. Update tests if applicable

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit changes
4. Push to the branch
5. Create a Pull Request