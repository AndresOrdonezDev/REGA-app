import * as Sharing from 'expo-sharing';
import * as FileSystem from 'expo-file-system';
import XLSX from 'xlsx';

// Helper function to convert Uint8Array to Base64
function uint8ToBase64(uint8Array) {
    const binary = String.fromCharCode(...uint8Array);
    return btoa(binary);
}

export async function exportToExcel(data, filename) {
    try {
        if (!Array.isArray(data) || data.length === 0) {
            throw new Error("No data available to export.");
        }
        const worksheet = XLSX.utils.json_to_sheet(data);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Persons");
        const excelData = XLSX.write(workbook, { type: "binary", bookType: "xlsx" });
        const buffer = new ArrayBuffer(excelData.length);
        const view = new Uint8Array(buffer);
        for (let i = 0; i < excelData.length; i++) {
            view[i] = excelData.charCodeAt(i) & 0xff;
        }
        const base64Data = uint8ToBase64(view);
        const fileUri = FileSystem.cacheDirectory + filename;
        await FileSystem.writeAsStringAsync(fileUri, base64Data, {
            encoding: FileSystem.EncodingType.Base64,
        });

        if (!(await Sharing.isAvailableAsync())) {
            throw new Error("Sharing is not available on this platform.");
        }
        await Sharing.shareAsync(fileUri);

    } catch (error) {
        console.error("Error exporting to Excel:", error);
        throw error;
    }
}