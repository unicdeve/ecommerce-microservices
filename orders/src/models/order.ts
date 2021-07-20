import mongoose from 'mongoose';
import { OrderStatus } from '@unicdeve/common';
import { TicketDoc } from './ticket';

export { OrderStatus };
interface OrderAttrs {
	status: OrderStatus;
	userId: string;
	expiresAt: Date;
	ticket: TicketDoc;
}

interface OrderDoc extends mongoose.Document {
	status: OrderStatus;
	userId: string;
	expiresAt: Date;
	ticket: TicketDoc;
	version: number;
}

interface OrderModel extends mongoose.Model<OrderDoc> {
	build(attrs: OrderAttrs): OrderDoc;
}

const orderSchema = new mongoose.Schema(
	{
		userId: {
			type: String,
			required: true,
		},

		status: {
			type: String,
			required: true,
			enum: Object.values(OrderStatus),
			default: OrderStatus.Created,
		},

		expiresAt: {
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

orderSchema.set('versionKey', 'version');
orderSchema.pre('save', function (done) {
	// @ts-ignore
	this.$where = {
		version: this.get('version') - 1,
	};

	done();
});

orderSchema.statics.build = (attrs: OrderAttrs) => {
	return new Order(attrs);
};

orderSchema.statics.findByEvent = async function (event: {
	id: string;
	version: number;
}) {
	return Order.findOne({ _id: event.id, version: event.version - 1 });
};

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };
