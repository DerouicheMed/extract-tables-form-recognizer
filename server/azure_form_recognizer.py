from azure.ai.formrecognizer import DocumentAnalysisClient
from azure.core.credentials import AzureKeyCredential

API_URL = "YOUR_API_URL"
KEY = "YOUR_KEY"


class AzureFormRecognizer:
    @classmethod
    def get(cls, file):
        # init client
        document_analysis_client = DocumentAnalysisClient(
            endpoint=API_URL, credential=AzureKeyCredential(KEY)
        )
        # call function & return result
        poller = document_analysis_client.begin_analyze_document(
            "prebuilt-layout", file
        )
        data = poller.result()
        # get tables from result
        tables = [table.to_dict() for table in data.tables]
        return tables
