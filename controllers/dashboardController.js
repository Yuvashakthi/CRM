const Client = require('../models/Client');
const Invoice = require('../models/Invoice');
const Billing = require('../models/Billing');

exports.getDashboardStats = async (req, res) => {
  try {
    // Clients
    const totalClients = await Client.countDocuments();
    const activeClients = await Client.countDocuments({ status: 'Active' });
    const inactiveClients = await Client.countDocuments({ status: 'Inactive' });

    // Invoices
    const invoices = await Invoice.find();
    let totalInvoiceAmount = 0;
    let paidInvoiceAmount = 0;
    let unpaidInvoiceAmount = 0;

    invoices.forEach(inv => {
      const amount = parseFloat(inv.dueAmount) || 0;
      totalInvoiceAmount += amount;

      if (inv.status === 'Paid' || inv.status === 'Partially Paid') {
        paidInvoiceAmount += amount;
      } else {
        unpaidInvoiceAmount += amount;
      }
    });

    // Billings
    const billings = await Billing.find();
    let totalBillingAmount = 0;
    let paidBillingAmount = 0;

    billings.forEach(bill => {
      const amount = parseFloat(bill.paidAmount) || 0;
      totalBillingAmount += amount;

      if ((bill.status || '').toLowerCase() === 'billed') {
        paidBillingAmount += amount;
      }
    });

    // Unpaid = Total - Paid
    const unpaidBillingAmount = totalBillingAmount - paidBillingAmount;

    res.json({
      clients: {
        total: totalClients,
        active: activeClients,
        inactive: inactiveClients
      },
      invoices: {
        totalAmount: totalInvoiceAmount,
        paidAmount: paidInvoiceAmount,
        unpaidAmount: unpaidInvoiceAmount
      },
      billings: {
        totalAmount: totalBillingAmount,
        paidAmount: paidBillingAmount,
        unpaidAmount: unpaidBillingAmount < 0 ? 0 : unpaidBillingAmount
      }
    });
  } catch (error) {
    console.error('Dashboard stats error:', error);
    res.status(500).json({ error: 'Failed to fetch dashboard statistics' });
  }
};
