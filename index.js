const express = require('express');
const cors = require('cors');
const mysql = require('mysql');
const bodyParser = require('body-parser');

const db = mysql.createConnection({
  host: 'mysql-vertex1234.alwaysdata.net',
  user: '387119',
  password: 'H..e..240898',
  database: 'vertex1234_data',
});

db.connect((err) => {
  if (err) {
    console.error('Database connection failed:', err);
    return;
  }
  console.log('Connected to MySQL database.');
});

const app = express();
const port = 3000;
const host = 'localhost';

app.use(bodyParser.json());
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());

app.get('/users', (req, res) => {
  const sql = 'SELECT * FROM users'; 
  db.query(sql, (err, results) => {
    if (err) {
      res.status(500).send(err);
      return;
    }
    res.json(results);
  });
});

// ^----------------- Archive Mortgage --------------//

app.get('/archivemortgage', (req, res) => {
  const sql = 'SELECT * FROM MortgageData WHERE isArchived = TRUE';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ error: 'تعذر الوصول الي البيانات' });
      return;
    }
    res.status(200).json(results);
  });
});
app.post('/archivemortgage', (req, res) => {
  const { registrationNumber } = req.body;
  console.log(req.body);
  if (!registrationNumber) {
    return res.status(400).json({ message: 'يجب إرسال registrationNumber.' });
  }

  // تحديث الحقل isArchived فقط
  const updateQuery = `
      UPDATE MortgageData
      SET isArchived = TRUE
      WHERE registrationNumber = ?;
  `;

  // تنفيذ استعلام التحديث فقط
  db.query(updateQuery, [registrationNumber], (err, result) => {
    if (err) {
      console.error('خطأ أثناء تحديث البيانات:', err);
      return res.status(500).json({ message: 'خطأ أثناء تحديث البيانات.' });
    }

    res.status(200).json({ message: 'تم تحديث الحالة بنجاح.' });
  });
});



// ^----------------- End Archive Mortgage --------------//

// *----------------- Additional Mortgage --------------//

app.post('/additionalmortgage', (req, res) => {
  const {
    mortgageType,
    mortgageDate,
    creditorName,
    debtorName,
    mortgageAmount,
    mortgageDuration,
    registrationNumber,
    requestNumber,
    documentationNumber,
    approvalRecord,
    renewalDate,
    mortgageNote,
    canceledMortgages,
    mortgageAttachment
  } = req.body;

  const sql = `
    INSERT INTO additionalMortgageData (
      mortgageType, mortgageDate, creditorName, debtorName, mortgageAmount, 
      mortgageDuration, registrationNumber, requestNumber, documentationNumber, 
      approvalRecord, renewalDate, mortgageNote, mortgageAttachment, canceledMortgages
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    mortgageType, mortgageDate, creditorName, debtorName, mortgageAmount,
    mortgageDuration, registrationNumber, requestNumber, documentationNumber,
    approvalRecord, renewalDate, mortgageNote, mortgageAttachment, canceledMortgages
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      if (err.sqlMessage && err.sqlMessage.includes('Duplicate entry')) {
        // إرسال رسالة خطأ مخصصة
        return res.status(400).json({
          success: false,
          message: 'الطلب موجود مسبقًا',
          error: err
        });
      }
      // معالجة الأخطاء الأخرى
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إضافة البيانات',
        error: err
      });
    }

    // إرسال استجابة ناجحة
    res.status(200).json({
      success: true,
      message: 'تم إضافة الرهن بنجاح',
      data: result
    });
  });
});

app.get('/additionalmortgage', (req, res) => {
  const sql = 'SELECT * FROM additionalMortgageData';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ error: 'تعذر الوصول الي البيانات' });
      return;
    }
    res.status(200).json(results);
  });
});


// *----------------- End Additional Mortgage --------------//

// &--------------------- implementation -------------------//

app.post('/implementation', (req, res) => {
  const {
    judgmentRecord,
    precautionarySeizure,
    executionSeizure,
    ReservationDate,
    sessionDate,
    implementationNotes,
    attachments
  } = req.body;

  const sql = `
    INSERT INTO Implementation (
      judgmentRecord, precautionarySeizure, executionSeizure, ReservationDate, 
      sessionDate, implementationNotes, attachments
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    judgmentRecord, precautionarySeizure, executionSeizure, ReservationDate,
    sessionDate, implementationNotes, attachments
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.log(err);
      if (err.sqlMessage && err.sqlMessage.includes('Duplicate entry')) {
        // إرسال رسالة خطأ مخصصة
        return res.status(400).json({
          success: false,
          message: 'الطلب موجود مسبقًا',
          error: err
        });
      }
      // معالجة الأخطاء الأخرى
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إضافة البيانات',
        error: err
      });
    }

    // إرسال استجابة ناجحة
    res.status(200).json({
      success: true,
      message: 'تم إضافة التنفيذ بنجاح',
      data: result
    });
  });
});

app.get('/implementation', (req, res) => {
  const sql = 'SELECT * FROM Implementation WHERE isArchived = FALSE';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ error: 'تعذر الوصول الي البيانات' });
      return;
    }
    res.status(200).json(results);
  });
});

app.get('/archiveImplementation', (req, res) => {
  const sql = 'SELECT * FROM Implementation WHERE isArchived = TRUE';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ error: 'تعذر الوصول الي البيانات' });
      return;
    }
    res.status(200).json(results);
  });
});
app.post('/archiveImplementation', (req, res) => {
  const { id } = req.body;
  console.log(req.body);
  if (!id) {
    return res.status(400).json({ message: 'يجب إرسال id.' });
  }

  // تحديث الحقل isArchived فقط
  const updateQuery = `
      UPDATE Implementation
      SET isArchived = TRUE
      WHERE id = ?;
  `;

  // تنفيذ استعلام التحديث فقط
  db.query(updateQuery, [id], (err, result) => {
    if (err) {
      console.error('خطأ أثناء تحديث البيانات:', err);
      return res.status(500).json({ message: 'خطأ أثناء تحديث البيانات.' });
    }

    res.status(200).json({ message: 'تم تحديث الحالة بنجاح.' });
  });
});

// &----------------- End implementation --------------//

// *----------------- Mortgage --------------//

app.post('/mortgage', (req, res) => {
  const {
    mortgageType,
    mortgageDate,
    creditorName,
    debtorName,
    mortgageAmount,
    mortgageDuration,
    registrationNumber,
    requestNumber,
    documentationNumber,
    approvalRecord,
    renewalDate,
    mortgageNote,
    canceledMortgages,
    mortgageAttachment
  } = req.body;

  const sql = `
    INSERT INTO MortgageData (
      mortgageType, mortgageDate, creditorName, debtorName, mortgageAmount, 
      mortgageDuration, registrationNumber, requestNumber, documentationNumber, 
      approvalRecord, renewalDate, mortgageNote, mortgageAttachment, canceledMortgages
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    mortgageType, mortgageDate, creditorName, debtorName, mortgageAmount,
    mortgageDuration, registrationNumber, requestNumber, documentationNumber,
    approvalRecord, renewalDate, mortgageNote, mortgageAttachment, canceledMortgages
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      // console.log(err);
      if (err.sqlMessage && err.sqlMessage.includes('Duplicate entry')) {
        // إرسال رسالة خطأ مخصصة
        return res.status(400).json({
          success: false,
          message: 'الطلب موجود مسبقًا',
          error: err
        });
      }
      // معالجة الأخطاء الأخرى
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إضافة البيانات',
        error: err
      });
    }

    // إرسال استجابة ناجحة
    res.status(200).json({
      success: true,
      message: 'تم إضافة الرهن بنجاح',
      data: result
    });
  });
});

app.get('/mortgage', (req, res) => {
  const sql = 'SELECT * FROM MortgageData WHERE isArchived = FALSE';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ error: 'تعذر الوصول الي البيانات' });
      return;
    }
    res.status(200).json(results);
  });
});



// *----------------- End Mortgage --------------//

// ~--------------- Cases --------------------//
app.post('/casesRelation', (req, res) => {
  const casesRelation = req.body;
  // console.log('casesRelation Recived Data');
  const sql = `
        INSERT INTO RelationCases (
            fileNumberRelationCase,
            relationCaseCourtName,
            relationCasecourtType,
            relationCasebankRole,
            relationCaseRegistrationDate,
            relationCaseNumber,
            relationCasespecialistCategory,
            relationCaseallocatedValue,
            relationCaseassignedLawyer,
            relationCaseNotes,
            relationCaseAttachments
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
        casesRelation.relationCaseForm.fileNumberRelationCase,
        casesRelation.relationCaseForm.relationCaseCourtName,
        casesRelation.relationCaseForm.relationCasecourtType,
        casesRelation.relationCaseForm.relationCasebankRole,
        casesRelation.relationCaseForm.relationCaseRegistrationDate,
        casesRelation.relationCaseForm.relationCaseNumber,
        casesRelation.relationCaseForm.relationCasespecialistCategory,
        casesRelation.relationCaseForm.relationCaseallocatedValue,
        casesRelation.relationCaseForm.relationCaseassignedLawyer,
        casesRelation.relationCaseForm.relationCaseNotes,
        casesRelation.relationCaseForm.relationCaseAttachments
    ];
    db.query(sql, values, (err, result) => {
        if (err) {
            console.error('Error inserting data:', err);
            res.status(500).json({ error: 'تعذر حفظ البيانات' })
            return;
        }
        res.status(200).json({ message: 'تم حفظ البيانات بنجاح'});
    });
});

app.get('/casesRelation', (req, res) => {
  const sql = 'SELECT * FROM RelationCases';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ error: 'تعذر الوصول الي البيانات' });
      return;
    }
    res.status(200).json(results);
  });
});
app.get('/cases', (req, res) => {
  const sql = 'SELECT * FROM cases';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ error: 'Failed to retrieve reservation data' });
      return;
    }
    res.status(200).json(results);
  });
});
app.post('/cases', (req, res) => {
  const receivedData = req.body;
  // console.log(receivedData);
  // وظيفة لاستبدال القيم الناقصة بـ null
  const setDefault = (value, defaultValue = null) => (value !== undefined && value !== null ? value : defaultValue);

  // استخراج البيانات
  const {
    caseForm = null,
    caseSubject = null,
    opponents = null,
    session = null
  } = receivedData;

  const {
    caseSubjectSessionDate = null,
    caseSubject: caseSubjectText = null,
    caseSubjectSessionAction = null,
    caseSubjectAttachments = null
  } = caseSubject || {};

  const {
    opponentsInputName = null,
    opponentsName = null,
    opponentsBranch = null,
    amountDebt = null,
    claimedAmount = null,
    otherDebts = null,
    otherAccounts = null,
    accountNumber = null,
    opponentsNotes = null,
    opponentsAttachments = null
  } = opponents || {};

  const {
    statementType = null,
    sessionDate = null,
    assignedLawyer = null,
    sessionCourtName = null,
    sessionCourtLevel = null,
    sessionDecision = null,
    sessionTextAction = null,
    sessionType = null,
    nextSessionDate = null,
    sessionNotes = null,
    sessionAttachments = null
  } = session || {};

  const {
    caseType = null,
    caseNumber = null,
    courtType = null,
    caseRegistrationDate = null,
    caseAnnouncementDate = null,
    caseNextSessionDate = null,
    fileNumber = null,
    bankRole = null,
    caseManagement = null,
    court = null,
    caseYear = null,
    caseTitle = null,
    circleNumber = null,
    caseRollNumber = null,
    specialistCategory = null,
    allocatedValue = null,
    judgmentStatement = null,
    legalRepresentativeName = null,
    legalRepresentativePosition = null,
    legalRepresentativenationalID = null,
    caseNotes = null,
    caseAttachments = null
  } = caseForm || {};

  const query = `
    INSERT INTO cases (
      caseType, caseNumber, courtType, caseRegistrationDate, caseAnnouncementDate,
      caseNextSessionDate, fileNumber, bankRole, caseManagement, court, caseYear,
      caseTitle, circleNumber, caseRollNumber, specialistCategory, allocatedValue,
      judgmentStatement, legalRepresentativeName, legalRepresentativePosition,
      legalRepresentativenationalID, caseNotes, caseAttachments, opponentsInputName,
      opponentsName, opponentsBranch, amountDebt, claimedAmount, otherDebts,
      otherAccounts, accountNumber, opponentsNotes, opponentsAttachments,
      caseSubjectSessionDate, caseSubject, caseSubjectSessionAction, caseSubjectAttachments,
      statementType, sessionDate, assignedLawyer, sessionCourtName, sessionCourtLevel,
      sessionDecision, sessionTextAction, sessionType, nextSessionDate, sessionNotes,
      sessionAttachments
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    setDefault(caseType), setDefault(caseNumber), setDefault(courtType), setDefault(caseRegistrationDate), setDefault(caseAnnouncementDate),
    setDefault(caseNextSessionDate), setDefault(fileNumber), setDefault(bankRole), setDefault(caseManagement), setDefault(court), setDefault(caseYear),
    setDefault(caseTitle), setDefault(circleNumber), setDefault(caseRollNumber), setDefault(specialistCategory), setDefault(allocatedValue),
    setDefault(judgmentStatement), setDefault(legalRepresentativeName), setDefault(legalRepresentativePosition),
    setDefault(legalRepresentativenationalID), setDefault(caseNotes), setDefault(null), setDefault(opponentsInputName),setDefault(opponentsName), setDefault(opponentsBranch), setDefault(amountDebt), setDefault(claimedAmount), setDefault(otherDebts),setDefault(otherAccounts), setDefault(accountNumber), setDefault(opponentsNotes), setDefault(null),setDefault(caseSubjectSessionDate), setDefault(caseSubjectText), setDefault(caseSubjectSessionAction),setDefault(null),setDefault(statementType), setDefault(sessionDate), setDefault(assignedLawyer), setDefault(sessionCourtName), setDefault(sessionCourtLevel),setDefault(sessionDecision), setDefault(sessionTextAction), setDefault(sessionType), setDefault(nextSessionDate), setDefault(sessionNotes),setDefault(null)
  ];

  db.query(query, values, (err, result) => {
    if (err) {
      console.log(err);
      if (err.sqlMessage && err.sqlMessage.includes('Duplicate entry')) {
        // إرسال رسالة خطأ مخصصة
        return res.status(400).json({
          success: false,
          message: 'الطلب موجود مسبقًا',
          error: err
        });
      }
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إضافة البيانات',
        error: err
      });
    }

    // إرسال استجابة ناجحة
    res.status(200).json({
      success: true,
      message: 'تم حفظ بيانات القضية',
      data: result
    });
  });
});


// ~--------------- End Cases --------------------//

// !--------------- Reservation --------------------//

app.post('/reservations', (req, res) => {
  const {
    startDate,
    ReservationType,
    clientName,
    idNumber,
    reservationCost,
    revervationNumber,
    revervationLocation,
    revervationSide,
    reservationClaims,
    courtOrder,
    receivableReport,
    Implementation,
    notes
  } = req.body;

  const sql = `
    INSERT INTO reservations (
      startDate, ReservationType, clientName, idNumber,
      reservationCost, revervationNumber, revervationLocation,
      revervationSide, reservationClaims, courtOrder,
      receivableReport, Implementation, notes
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    startDate,
    ReservationType,
    clientName,
    idNumber,
    reservationCost,
    revervationNumber,
    revervationLocation,
    revervationSide,
    reservationClaims,
    courtOrder,
    receivableReport,
    Implementation,
    notes
  ];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error('Error inserting data:', err);
      res.status(500).json({ error: 'Failed to insert reservation data' });
      return;
    }
    res.status(201).json({ message: 'Reservation added successfully', id: result.insertId });
  });
});

app.get('/reservations', (req, res) => {
  const sql = 'SELECT * FROM reservations';

  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ error: 'Failed to retrieve reservation data' });
      return;
    }
    res.status(200).json(results);
  });
});
// !--------------- End Reservation --------------------//

//  ? ----------------   Investigation   ------------------//


app.post("/investigation", (req, res) => {
  const {
    prosecutorName,
    defendantName,
    actionTaken,
    dateAdded,
    investigatorName,
    investigationDate,
    incident,
    incidentAction,
    notes,
    investigationAttachment,
  } = req.body;

  const query = `
    INSERT INTO investigation (
      prosecutorName, defendantName, actionTaken, dateAdded, investigatorName, 
      investigationDate, incident, incidentAction, notes, investigationAttatchment
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;

  const values = [
    prosecutorName,
    defendantName,
    actionTaken,
    dateAdded,
    investigatorName,
    investigationDate,
    incident,
    incidentAction,
    notes,
    investigationAttachment,
  ];

  db.query(query, values, (err, result) => {
    if (err) { 
      console.log(err);
      if (err.sqlMessage && err.sqlMessage.includes('Duplicate entry')) {
        // إرسال رسالة خطأ مخصصة
        return res.status(400).json({
          success: false,
          message: 'الطلب موجود مسبقًا',
          error: err
        });
      }
      // معالجة الأخطاء الأخرى
      return res.status(500).json({
        success: false,
        message: 'حدث خطأ أثناء إضافة البيانات',
        error: err
      });
    }

    // إرسال استجابة ناجحة
    res.status(200).json({
      success: true,
      message: 'تم حفظ بيانات التحقيق',
      data: result
    });
  });
});



app.get('/investigation', (req, res) => {
  const sql = 'SELECT * FROM investigation';
  // console.log("investigation is Done");
  db.query(sql, (err, results) => {
    if (err) {
      console.error('Error retrieving data:', err);
      res.status(500).json({ error: 'Failed to retrieve reservation data' });
      return;
    }
    res.status(200).json(results);
  });
});


//  ? --------------   End Investigation   ----------------//





app.get('/', (req, res) => {
  res.status(200).send('Home Page');
});

// Handle 404 for undefined routes
app.use((req, res) => {
  res.status(404).send('Page Not Found');
});

app.listen(port, host, () => {
  console.log(`Server is running on http://${host}:${port}`);
});
