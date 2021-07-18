import mongoose from 'mongoose';

interface OrderAttrs {
	status: string;
	userId: string;
	expiresAt: Date;
	// ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
	status: string;
	userId: string;
	expiresAt: Date;
	// ticket: TicketDoc;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

const OrderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},

		status: {
			type: String,
			required: true,
		},

		expires: {
			type: mongoose.Schema.Types.Date,
		},

		ticket: {
			type: mongoose.Schema.Types.ObjectId,
			ref: 'Ticket',
		},
	},
	{
		toJSON: {
			transform(doc, ret) {
				ret.id = ret._id;
				delete ret._id;
				delete ret.__v;
			},
		},
	}
);

OrderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order(attrs);
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', OrderSchema);

export { Order };
