import Image from "next/image";
import file from "../images/demo-page/file-icon.jpg";

interface IDocument {
  name: string;
}

type DocumentProps = {
  document: IDocument;
};

const Document: React.FC<DocumentProps> = ({ document }) => {
  return (
    <button className="p-6">
      <div className="grid">
        <Image
          alt="House Stock Image"
          src={file}
          className="h-24 w-24 min-w-fit justify-self-center rounded-xl p-3"
        />
        <p className="">{document.name}</p>
      </div>
    </button>
  );
};

type Props = {
  documents: IDocument[];
};

export const Documents: React.FC<Props> = ({ documents }) => {
  return (
    <div className="flex overflow-x-auto ">
      {documents.map((document, index) => {
        return <Document document={document} key={index} />;
      })}
    </div>
  );
};

export default Documents;
