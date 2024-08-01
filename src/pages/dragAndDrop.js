import { propTypes } from "@themesberg/react-bootstrap/lib/esm/Image";
import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import styled from "styled-components";

const DropzoneWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 20px;
  border: 2px dashed #cccccc;
  border-radius: 5px;
  cursor: pointer;
  transition: border 0.3s ease-in-out;

  &:hover {
    border-color: #007bff;
  }
`;

const FileList = styled.ul`
  list-style: none;
  margin: 10px;
  padding: 0;
`;

const FileListItem = styled.li`
  margin: 5px 0;
`;

const DragAndDrop = (props) => {
  // const [props.droppedFiles, props.setDroppedFiles] = useState([]);

  const onDrop = useCallback(
    (acceptedFiles) => {
      // Handle the dropped files here
      props.getFiles(acceptedFiles);

      // Add dropped files to the state
      props.setDroppedFiles([...props.droppedFiles, ...acceptedFiles]);
    },
    [props.droppedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <DropzoneWrapper {...getRootProps()}>
      <input {...getInputProps()} />
      {isDragActive ? (
        <p>Drop the files here...</p>
      ) : (
        <p>Drag and drop files here, or click to select files</p>
      )}
      {props?.droppedFiles?.length > 0 && (
        <FileList>
          {props.droppedFiles.map((file, index) => (
            <FileListItem key={index}>{file.name}</FileListItem>
          ))}
        </FileList>
      )}
    </DropzoneWrapper>
  );
};

export default DragAndDrop;
