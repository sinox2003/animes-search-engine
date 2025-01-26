
interface PdfViewerProps {
  pdfUrl: string;
  onClose: () => void;
}

const PdfViewer: React.FC<PdfViewerProps> = ({ pdfUrl, onClose }) => {
  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      onClick={onClose}
    >
      <div
        className="bg-gray-900 p-4 rounded-md shadow-lg relative max-w-4xl w-full"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        <h3 className="text-lg font-semibold mb-2 text-white">PDF Viewer</h3>
        <iframe
          src={pdfUrl}
          title="PDF Viewer"
          width="100%"
          height="500px"
          className="border border-gray-700 rounded-md"
        ></iframe>
        <button
          onClick={onClose}
          className="absolute top-2 right-2 px-3 py-1 bg-red-600 text-white rounded hover:bg-red-700"
        >
          ✕
        </button>
      </div>
    </div>
  );
};

export default PdfViewer;
