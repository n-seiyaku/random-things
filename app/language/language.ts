import { Language, Translations } from '../types/type'

export const translations: Record<Language, Translations> = {
  vi: {
    heroTitle: 'QR Scanner',
    heroDesc: 'Trái: quét bằng camera. Phải: QR đã cắt & nội dung giải mã.',
    overlayDrop: 'Thả ảnh vào bất kỳ đâu để quét',
    analyzing: 'Đang phân tích ảnh...',
    found: 'Đã tìm thấy QR trong ảnh ✅',
    notFound: 'Không tìm thấy QR trong ảnh 🤧',
    copied: 'Đã copy nội dung QR vào clipboard ✅',
    notUrl: 'Nội dung QR không phải URL hợp lệ 🤔',
    cameraFound: 'Đã quét QR từ camera ✅',
    statusLabel: {
      idle: 'Chưa chọn ảnh',
      scanning: 'Đang quét QR...',
      success: 'Quét thành công',
      error: 'Lỗi quét',
    },
    camera: {
      title: 'Quét bằng camera',
      hint: 'Camera chưa bật. Nhấn "Bật camera" để bắt đầu quét QR trực tiếp.',
      start: 'Bật camera để quét',
      stop: 'Tắt camera',
      note: 'Lưu ý: Trình duyệt sẽ hỏi quyền truy cập camera lần đầu.',
      error: 'Không mở được camera. Hãy kiểm tra quyền truy cập.',
    },
    uploadCard: {
      title: 'QR sau khi cắt (từ ảnh)',
      placeholderTitle: 'Bấm để chọn ảnh hoặc kéo thả file vào cửa sổ',
      placeholderSub: 'Hệ thống sẽ tự tìm QR trong ảnh & cắt riêng khu vực QR.',
      icon: '📸',
    },
    resultCard: {
      title: 'Nội dung QR',
      empty: 'Nội dung giải mã sẽ hiện ở đây sau khi hệ thống đọc được QR.',
    },
    buttons: {
      copy: '📋 Copy nội dung',
      openUrl: '🌐 Mở nếu là URL',
      reset: '♻️ Làm mới',
    },
    realtime: 'Realtime decode',
    sourceTextareaPlaceholder: 'Dán trực tiếp ảnh hoặc URL ảnh vào đây',
  },
  en: {
    heroTitle: 'QR Scanner',
    heroDesc: 'Left: scan with camera. Right: cropped QR & decoded content.',
    overlayDrop: 'Drop an image anywhere to scan',
    analyzing: 'Analyzing image...',
    found: 'QR detected in the image ✅',
    notFound: 'No QR found in the image 🤧',
    copied: 'QR content copied to clipboard ✅',
    notUrl: 'The QR content is not a valid URL 🤔',
    cameraFound: 'QR scanned from camera ✅',
    statusLabel: {
      idle: 'No image selected',
      scanning: 'Scanning QR...',
      success: 'Scan complete',
      error: 'Scan failed',
    },
    camera: {
      title: 'Scan with Camera',
      hint: 'Camera is currently off. Click "Start Camera" to scan QR live.',
      start: 'Start Camera',
      stop: 'Stop Camera',
      note: 'Note: Your browser may ask for camera permission the first time.',
      error: 'Failed to access camera. Please check permissions.',
    },
    uploadCard: {
      title: 'Cropped QR (from image)',
      placeholderTitle: 'Click or drop an image file to upload',
      placeholderSub:
        'The system will detect the QR and crop it automatically for you.',
      icon: '🖼️',
    },
    resultCard: {
      title: 'QR Content',
      empty: 'Decoded content will appear here after scanning.',
    },
    buttons: {
      copy: '📋 Copy Content',
      openUrl: '🌐 Open if URL',
      reset: '♻️ Reset',
    },
    realtime: 'Realtime decode',
    sourceTextareaPlaceholder:
      'Paste the image or the image URL directly here.',
  },
  ja: {
    heroTitle: 'QRスキャナー',
    heroDesc: '左：カメラでスキャン　右：切り出したQRと読み取り結果',
    overlayDrop: '画像をドロップするとスキャンできます',
    analyzing: '画像を解析中...',
    found: 'QRコードを検出しました ✅',
    notFound: 'QRコードが見つかりませんでした 🤧',
    copied: 'QRの内容をコピーしました ✅',
    notUrl: 'QRの内容は有効なURLではありません 🤔',
    cameraFound: 'カメラでQRを読み取りました ✅',
    statusLabel: {
      idle: '画像がまだ選択されていません',
      scanning: 'QRをスキャン中...',
      success: 'スキャン完了',
      error: 'スキャンに失敗しました',
    },
    camera: {
      title: 'カメラでスキャン',
      hint: 'カメラはまだ起動していません。「カメラを開始」を押してライブスキャンを始めましょう。',
      start: 'カメラを開始',
      stop: 'カメラを停止',
      note: '初回のみ、ブラウザからカメラ許可の確認があります。',
      error: 'カメラにアクセスできません。権限をご確認ください。',
    },
    uploadCard: {
      title: '切り出されたQR（画像から）',
      placeholderTitle:
        '画像をクリックして選択、またはファイルをドロップしてください',
      placeholderSub: 'QRコードを自動検出し、QR部分だけを切り出します。',
      icon: '🖼️',
    },
    resultCard: {
      title: 'QRの内容',
      empty: 'スキャン後にQRの内容がここに表示されます。',
    },
    buttons: {
      copy: '📋 内容をコピー',
      openUrl: '🌐 URLなら開く',
      reset: '♻️ リセット',
    },
    realtime: 'リアルタイムデコード',
    sourceTextareaPlaceholder:
      'ここに画像または画像のURLを直接貼り付けてください',
  },
}
