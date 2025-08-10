import { Button, Checkbox, Form, Input } from 'antd';

const RecordMeterForm = () => {
    return (
        <div>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                //onFinish={handleSubmit}
                // onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item
                    label="ID đồng hồ cũ"
                    name="meter_id_old"
                    rules={[{ required: true, message: 'Vui lòng nhập ID đồng hồ' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Họ và tên khách hàng"
                    name="full_name"
                    rules={[{ required: true, message: 'Vui lòng nhập họ và tên khách hàng' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Địa chỉ"
                    name="address"
                    rules={[{ required: true, message: 'Vui lòng nhập địa chỉ' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Số đọc"
                    name="meter_book_number"
                >
                    <Input />
                </Form.Item>

                <Form.Item
                    label="Chỉ số đồng hồ"
                    name="meter_value"
                >
                    <Input />
                </Form.Item>

                <Form.Item label={null}>
                    <Button type="primary" htmlType="submit">
                        Tạo công việc mới
                    </Button>
                </Form.Item>
            </Form>
        </div>
    )
}

export default RecordMeterForm