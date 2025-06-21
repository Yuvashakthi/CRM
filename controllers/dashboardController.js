const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const Billing = require('../models/Billing');

exports.getDashboardStats = async (req, res) => {
  try {
    const totalClients = await Client.countDocuments();
    const activeClients = await Client.countDocuments({ status: 'Active' });
    const inactiveClients = await Client.countDocuments({ status: 'Inactive' });

    const invoices = await Invoice.find();
    const totalInvoiceAmount = invoices.reduce((sum, inv) => sum + (parseFloat(inv.dueAmount) || 0), 0);
    const paidInvoices = invoices.filter(inv => inv.status === 'Paid').length;
    const unpaidInvoices = invoices.filter(inv => inv.status === 'Unpaid').length;

    const billings = await Billing.find();
    const totalBillingAmount = billings.reduce((sum, bill) => sum + (parseFloat(bill.paidAmount) || 0), 0);

    res.json({
      clients: {
        total: totalClients,
        active: activeClients,
        inactive: inactiveClients
      },
      invoices: {
        total: invoices.length,
        totalAmount: totalInvoiceAmount,
        paidCount: paidInvoices,
        unpaidCount: unpaidInvoices
      },
      billings: {
        total: billings.length,
        totalPaid: totalBillingAmount
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};
