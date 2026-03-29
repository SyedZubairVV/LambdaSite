const functions = [
  {
    id: 'save-text',
    name: 'Save Text to Storage',
    description: 'Saves text content as a file in Azure Blob Storage.',
    endpoint: import.meta.env.VITE_SAVE_URL,
    method: 'POST',
    inputFields: [
      { name: 'filename', label: 'Filename', type: 'text', placeholder: 'my-note.txt' },
      { name: 'text', label: 'Text Content', type: 'textarea', placeholder: 'Enter your text here...' },
    ],
  },
  {
    id: 'file-browser',
    name: 'File Browser',
    description: 'Browse and read files stored in Azure Blob Storage.',
    type: 'file-browser',
    listEndpoint: import.meta.env.VITE_LIST_URL,
    getEndpoint: import.meta.env.VITE_GET_URL,
    inputFields: [],
  },
]

export default functions
