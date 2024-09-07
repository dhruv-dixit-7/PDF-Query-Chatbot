import pandas as pd
import numpy as np

import os
import sys
import inspect

from langchain.chains import RetrievalQA
from langchain.embeddings import HuggingFaceEmbeddings
from langchain.llms import LlamaCpp
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain.vectorstores import FAISS
from langchain.document_loaders import PyPDFDirectoryLoader
from langchain_community.llms import LlamaCpp

current_code_path = os.path.dirname(os.path.abspath(inspect.getfile(inspect.currentframe())))
path_of_data_directory = current_code_path + "\\data_files"

# loader = PyPDFDirectoryLoader("D:\\Projects\\All Purpose Chatbot\\Mistral_Implementation\\data_files")
loader = PyPDFDirectoryLoader(path_of_data_directory)
data = loader.load()

text_splitter = RecursiveCharacterTextSplitter(chunk_size = 1000, 
                                               chunk_overlap = 20)

text_chunks = text_splitter.split_documents(data)

embeddings = HuggingFaceEmbeddings(model_name = "sentence-transformers/all-MiniLM-L6-v2")

vector_store = FAISS.from_documents(text_chunks, 
                                    embedding = embeddings)

model_path = current_code_path + "\\mistral-7b-instruct-v0.1.Q2_K.gguf"

llm = LlamaCpp(
    streaming = True,
    model_path = model_path,
    temperature = 0.75,
    top_p = 1,
    verbose = True,
    n_ctx = 4096
)

qa = RetrievalQA.from_chain_type(llm = llm, 
                                 chain_type = "stuff", 
                                 retriever = vector_store.as_retriever(search_kwargs = {"k": 2}))

def chatbot(user_input):
   answer = qa.run(user_input)

   return answer

   
   
