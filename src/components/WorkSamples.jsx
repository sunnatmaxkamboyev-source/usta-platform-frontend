
import { useEffect, useRef, useState } from "react";
import {
  Button,
  Card,
  Empty,
  Form,
  Input,
  Modal,
  Popconfirm,
  Upload,
  message,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
} from "@ant-design/icons";

const STORAGE_KEY = "ustaWorkSamples";
const MAX_IMAGES = 3;
const MAX_IMAGE_SIZE = 1024 * 1024;

function readSamples() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
  } catch {
    return [];
  }
}

function readImage(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result === "string") {
        resolve(reader.result);
      } else {
        reject(new Error("Rasmni o‘qib bo‘lmadi."));
      }
    };

    reader.onerror = () => reject(new Error("Rasmni o‘qishda xatolik."));
    reader.readAsDataURL(file);
  });
}

export default function WorkSamples() {
  const [samples, setSamples] = useState(readSamples);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [images, setImages] = useState([]);
  const [form] = Form.useForm();
  const fileInputRef = useRef(null);

  const persistSamples = (nextSamples) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextSamples));
      setSamples(nextSamples);
      return true;
    } catch (error) {
      console.error("Ish namunalarini saqlash xatosi:", error);
      message.error(
        "Brauzer xotirasi to‘ldi. Rasmlar hajmini kamaytirib ko‘ring."
      );
      return false;
    }
  };

  const openCreateModal = () => {
    setEditingId(null);
    setImages([]);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (sample) => {
    setEditingId(sample.id);
    setImages(
      sample.images.map((image, index) => ({
        uid: `${sample.id}-${index}`,
        name: `namuna-${index + 1}.jpg`,
        status: "done",
        url: image,
        dataUrl: image,
      }))
    );
    form.setFieldsValue({
      title: sample.title,
      description: sample.description,
    });
    setModalOpen(true);
  };

  const closeModal = () => {
    if (saving) return;
    setModalOpen(false);
    setEditingId(null);
    setImages([]);
    form.resetFields();
  };

  const handleSelectImages = async (event) => {
    const files = Array.from(event.target.files || []);
    event.target.value = "";

    if (!files.length) return;

    const remaining = MAX_IMAGES - images.length;

    if (remaining <= 0) {
      message.warning("Har bir namuna uchun ko‘pi bilan 3 ta rasm mumkin.");
      return;
    }

    const selectedFiles = files.slice(0, remaining);

    if (files.length > remaining) {
      message.warning(`Faqat yana ${remaining} ta rasm qo‘shish mumkin.`);
    }

    const newImages = [];

    for (const file of selectedFiles) {
      if (!file.type.startsWith("image/")) {
        message.error(`${file.name}: rasm faylini tanlang.`);
        continue;
      }

      if (file.size > MAX_IMAGE_SIZE) {
        message.error(`${file.name}: rasm 1 MB dan kichik bo‘lishi kerak.`);
        continue;
      }

      try {
        const dataUrl = await readImage(file);

        newImages.push({
          uid: `${Date.now()}-${Math.random()}`,
          name: file.name,
          status: "done",
          url: dataUrl,
          dataUrl,
        });
      } catch {
        message.error(`${file.name}: rasmni o‘qib bo‘lmadi.`);
      }
    }

    setImages((previous) => [...previous, ...newImages].slice(0, MAX_IMAGES));
  };

  const removeImage = (uid) => {
    setImages((previous) => previous.filter((image) => image.uid !== uid));
  };

  const handleSave = async (values) => {
    if (images.length === 0) {
      message.warning("Kamida bitta rasm tanlang.");
      return;
    }

    setSaving(true);

    try {
      const sample = {
        id: editingId || `${Date.now()}`,
        title: values.title.trim(),
        description: values.description?.trim() || "",
        images: images.map((image) => image.dataUrl || image.url),
        updatedAt: new Date().toISOString(),
      };

      const nextSamples = editingId
        ? samples.map((item) => (item.id === editingId ? sample : item))
        : [sample, ...samples];

      if (persistSamples(nextSamples)) {
        message.success(
          editingId ? "Namuna yangilandi!" : "Ish namunasi qo‘shildi!"
        );
        setModalOpen(false);
        setEditingId(null);
        setImages([]);
        form.resetFields();
      }
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = (id) => {
    persistSamples(samples.filter((sample) => sample.id !== id));
  };

  return (
    <section className="mb-8">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-xl font-bold text-[#15233B]">
            Ish namunalarim
          </h2>
          <p className="mt-1 text-sm text-slate-500">
            Bajargan ishlaringizni rasmlar orqali mijozlarga ko‘rsating.
          </p>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
          className="!h-10 !rounded-lg !bg-blue-600"
        >
          Namuna qo‘shish
        </Button>
      </div>

      {samples.length === 0 ? (
        <Card className="!rounded-2xl !border-slate-200">
          <Empty
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            description="Hozircha ish namunalari yo‘q"
          >
            <Button
              type="primary"
              icon={<PlusOutlined />}
              onClick={openCreateModal}
              className="!rounded-lg !bg-blue-600"
            >
              Birinchi namunani qo‘shish
            </Button>
          </Empty>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {samples.map((sample) => (
            <Card
              key={sample.id}
              bordered={false}
              className="!overflow-hidden !rounded-2xl !border !border-slate-200 !shadow-sm"
              styles={{ body: { padding: 16 } }}
            >
              <div className="grid grid-cols-3 gap-2">
                {sample.images.map((image, index) => (
                  <img
                    key={`${sample.id}-${index}`}
                    src={image}
                    alt={`${sample.title} — ${index + 1}`}
                    className="aspect-square w-full rounded-lg bg-slate-100 object-cover"
                  />
                ))}
              </div>

              <h3 className="mt-4 break-words text-base font-bold text-[#15233B]">
                {sample.title}
              </h3>

              <p className="mt-2 whitespace-pre-wrap break-words text-sm leading-6 text-slate-500">
                {sample.description || "Izoh kiritilmagan."}
              </p>

              <p className="mt-3 flex items-center gap-2 text-xs text-slate-400">
                <PictureOutlined />
                {sample.images.length}/3 ta rasm
              </p>

              <div className="mt-4 flex gap-2 border-t border-slate-100 pt-4">
                <Button
                  block
                  icon={<EditOutlined />}
                  onClick={() => openEditModal(sample)}
                >
                  Tahrirlash
                </Button>

                <Popconfirm
                  title="Namunani o‘chirasizmi?"
                  description="Bu amalni ortga qaytarib bo‘lmaydi."
                  okText="O‘chirish"
                  cancelText="Bekor qilish"
                  okButtonProps={{ danger: true }}
                  onConfirm={() => handleDelete(sample.id)}
                >
                  <Button danger icon={<DeleteOutlined />}>
                    O‘chirish
                  </Button>
                </Popconfirm>
              </div>
            </Card>
          ))}
        </div>
      )}

      <Modal
        title={editingId ? "Ish namunasini tahrirlash" : "Yangi ish namunasi"}
        open={modalOpen}
        onCancel={closeModal}
        footer={null}
        destroyOnHidden
        centered
        width={560}
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSave}
          requiredMark={false}
        >
          <Form.Item
            label="Ish nomi"
            name="title"
            rules={[
              { required: true, message: "Ish nomini kiriting." },
              { min: 2, message: "Kamida 2 ta belgi kiriting." },
              { max: 80, message: "Nom 80 ta belgidan oshmasin." },
            ]}
          >
            <Input
              size="large"
              placeholder="Masalan: Hammom ta’mirlash"
              maxLength={80}
            />
          </Form.Item>

          <Form.Item
            label="Izoh"
            name="description"
            rules={[
              { max: 500, message: "Izoh 500 ta belgidan oshmasin." },
            ]}
          >
            <Input.TextArea
              rows={3}
              placeholder="Bu ish haqida qisqacha yozing..."
              maxLength={500}
              showCount
            />
          </Form.Item>

          <div className="mb-2 flex items-center justify-between gap-2">
            <span className="font-medium text-[#15233B]">
              Ish rasmlari
            </span>
            <span className="text-xs text-slate-500">
              {images.length}/3 ta
            </span>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleSelectImages}
          />

          <div className="grid grid-cols-3 gap-3">
            {images.map((image) => (
              <div key={image.uid} className="relative">
                <img
                  src={image.dataUrl || image.url}
                  alt={image.name}
                  className="aspect-square w-full rounded-xl border border-slate-200 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeImage(image.uid)}
                  aria-label="Rasmni olib tashlash"
                  className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-red-600 text-white shadow hover:bg-red-700"
                >
                  ×
                </button>
              </div>
            ))}

            {images.length < MAX_IMAGES && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-300 bg-slate-50 text-slate-500 transition hover:border-blue-400 hover:bg-blue-50 hover:text-blue-600"
              >
                <PlusOutlined className="text-xl" />
                <span className="text-xs">Rasm qo‘shish</span>
              </button>
            )}
          </div>

          <p className="mt-3 text-xs leading-5 text-slate-500">
            JPG, PNG yoki boshqa rasm formatlari. Har bir rasm 1 MB dan
            oshmasin. Hozircha ma’lumotlar faqat shu brauzerda saqlanadi.
          </p>

          <div className="mt-6 flex justify-end gap-2">
            <Button onClick={closeModal} disabled={saving}>
              Bekor qilish
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={saving}
              className="!bg-blue-600"
            >
              {editingId ? "Saqlash" : "Namuna qo‘shish"}
            </Button>
          </div>
        </Form>
      </Modal>
    </section>
  );
}
