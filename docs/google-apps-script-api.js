/**
 * Google Apps Script - Trading Journal API
 * 
 * SETUP:
 * 1. Tạo Google Sheets mới
 * 2. Vào Extensions > Apps Script
 * 3. Paste code này vào
 * 4. Deploy > New deployment > Web app
 * 5. Execute as: Me, Who has access: Anyone
 * 6. Copy URL và dùng trong React app
 */

const SHEET_NAME = 'Trades';

// ========== MAIN HANDLER ==========
function doGet(e) {
  return handleRequest(e);
}

function doPost(e) {
  return handleRequest(e);
}

function handleRequest(e) {
  const action = e.parameter.action;
  
  try {
    let result;
    
    switch (action) {
      case 'getTrades':
        result = getTrades();
        break;
      case 'logTrade':
        const tradeData = JSON.parse(e.postData.contents);
        result = logTrade(tradeData);
        break;
      case 'updateTrade':
        const updateData = JSON.parse(e.postData.contents);
        result = updateTrade(updateData);
        break;
      case 'deleteTrade':
        const deleteData = JSON.parse(e.postData.contents);
        result = deleteTrade(deleteData.id);
        break;
      case 'getStats':
        result = getStats();
        break;
      default:
        result = { error: 'Unknown action' };
    }
    
    return ContentService
      .createTextOutput(JSON.stringify(result))
      .setMimeType(ContentService.MimeType.JSON);
      
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// ========== HELPER FUNCTIONS ==========
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.insertSheet(SHEET_NAME);
    // Add headers
    sheet.getRange(1, 1, 1, 14).setValues([[
      'id', 'timestamp', 'coin', 'direction', 'entryPrice', 
      'stopLoss', 'takeProfit', 'positionSize', 'leverage', 
      'status', 'exitPrice', 'pnl', 'pnlPercent', 'notes'
    ]]);
    sheet.getRange(1, 1, 1, 14).setFontWeight('bold');
  }
  
  return sheet;
}

function generateId() {
  return Utilities.getUuid();
}

// ========== API FUNCTIONS ==========

/**
 * GET all trades
 */
function getTrades() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return { trades: [] };
  }
  
  const headers = data[0];
  const trades = [];
  
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const trade = {};
    
    headers.forEach((header, index) => {
      trade[header] = row[index];
    });
    
    trades.push(trade);
  }
  
  // Sort by timestamp descending (newest first)
  trades.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  return { trades };
}

/**
 * POST new trade
 */
function logTrade(data) {
  const sheet = getSheet();
  const id = generateId();
  const timestamp = new Date().toISOString();
  
  const row = [
    id,
    timestamp,
    data.coin || '',
    data.direction || 'long',
    data.entryPrice || 0,
    data.stopLoss || 0,
    data.takeProfit || 0,
    data.positionSize || 0,
    data.leverage || 1,
    data.status || 'open',
    data.exitPrice || '',
    data.pnl || '',
    data.pnlPercent || '',
    data.notes || ''
  ];
  
  sheet.appendRow(row);
  
  return { 
    success: true, 
    id,
    timestamp,
    message: 'Trade logged successfully' 
  };
}

/**
 * UPDATE trade (close trade, edit)
 */
function updateTrade(data) {
  const sheet = getSheet();
  const allData = sheet.getDataRange().getValues();
  const headers = allData[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idIndex] === data.id) {
      // Update each field if provided
      headers.forEach((header, colIndex) => {
        if (data[header] !== undefined && header !== 'id' && header !== 'timestamp') {
          sheet.getRange(i + 1, colIndex + 1).setValue(data[header]);
        }
      });
      
      return { success: true, message: 'Trade updated' };
    }
  }
  
  return { success: false, message: 'Trade not found' };
}

/**
 * DELETE trade
 */
function deleteTrade(id) {
  const sheet = getSheet();
  const allData = sheet.getDataRange().getValues();
  const idIndex = 0; // ID is first column
  
  for (let i = 1; i < allData.length; i++) {
    if (allData[i][idIndex] === id) {
      sheet.deleteRow(i + 1);
      return { success: true, message: 'Trade deleted' };
    }
  }
  
  return { success: false, message: 'Trade not found' };
}

/**
 * GET trading stats
 */
function getStats() {
  const sheet = getSheet();
  const data = sheet.getDataRange().getValues();
  
  if (data.length <= 1) {
    return {
      totalTrades: 0,
      openTrades: 0,
      wins: 0,
      losses: 0,
      winRate: 0,
      totalPnl: 0,
      avgRR: 0,
      maxDrawdown: 0,
      balanceHistory: []
    };
  }
  
  const headers = data[0];
  const statusIndex = headers.indexOf('status');
  const pnlIndex = headers.indexOf('pnl');
  const timestampIndex = headers.indexOf('timestamp');
  
  let wins = 0;
  let losses = 0;
  let openTrades = 0;
  let totalPnl = 0;
  const pnlHistory = [];
  
  for (let i = 1; i < data.length; i++) {
    const status = data[i][statusIndex];
    const pnl = parseFloat(data[i][pnlIndex]) || 0;
    const timestamp = data[i][timestampIndex];
    
    if (status === 'open') {
      openTrades++;
    } else if (status === 'win') {
      wins++;
      totalPnl += pnl;
      pnlHistory.push({ timestamp, pnl });
    } else if (status === 'loss') {
      losses++;
      totalPnl += pnl;
      pnlHistory.push({ timestamp, pnl });
    }
  }
  
  const closedTrades = wins + losses;
  const winRate = closedTrades > 0 ? (wins / closedTrades) * 100 : 0;
  
  // Calculate balance history and max drawdown
  pnlHistory.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  
  let balance = 0;
  let peak = 0;
  let maxDrawdown = 0;
  const balanceHistory = [];
  
  pnlHistory.forEach(item => {
    balance += item.pnl;
    balanceHistory.push({
      timestamp: item.timestamp,
      balance
    });
    
    if (balance > peak) {
      peak = balance;
    }
    
    const drawdown = peak - balance;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
    }
  });
  
  return {
    totalTrades: data.length - 1,
    openTrades,
    wins,
    losses,
    winRate: Math.round(winRate * 100) / 100,
    totalPnl: Math.round(totalPnl * 100) / 100,
    maxDrawdown: Math.round(maxDrawdown * 100) / 100,
    balanceHistory
  };
}
