/* ======================================================
   VIDYALAYAA — UNIFIED PORTAL JAVASCRIPT
   Role Switching, Data Interactivity, and Dynamic Controls
   ====================================================== */

const roleProfiles = {
  parent: {
    name: 'Priya Sharma',
    role: 'Parent • 2 Children',
    avatar: 'PS'
  },
  teacher: {
    name: 'Vikram Mehta',
    role: 'Sr. Mathematics Faculty',
    avatar: 'VM'
  },
  principal: {
    name: 'Dr. Rajeshwar Sharma',
    role: 'Principal • DPS North Campus',
    avatar: 'RS'
  },
  admin: {
    name: 'Super Admin Console',
    role: 'System & Hardware Admin',
    avatar: 'SA'
  },
  student: {
    name: 'Aarav Sharma',
    role: 'Student • Class 9-B (#18)',
    avatar: 'AS'
  }
};

// ---- Tab Switching ----
const roleTabs = document.querySelectorAll('.role-tab');
const panelViews = document.querySelectorAll('.panel-view');
const currentUserName = document.getElementById('current-user-name');
const currentUserRole = document.getElementById('current-user-role');
const currentAvatar = document.getElementById('current-avatar');

function switchRole(roleId) {
  // Update Tabs
  roleTabs.forEach(tab => {
    tab.classList.toggle('active', tab.dataset.role === roleId);
  });

  // Update Panels
  panelViews.forEach(panel => {
    panel.classList.toggle('active', panel.id === `panel-${roleId}`);
  });

  // Update Header User Profile
  if (roleProfiles[roleId]) {
    currentUserName.textContent = roleProfiles[roleId].name;
    currentUserRole.textContent = roleProfiles[roleId].role;
    currentAvatar.textContent = roleProfiles[roleId].avatar;
  }

  // Update URL state without reload
  const url = new URL(window.location);
  url.searchParams.set('role', roleId);
  window.history.replaceState({}, '', url);
}

roleTabs.forEach(tab => {
  tab.addEventListener('click', () => {
    const roleId = tab.dataset.role;
    switchRole(roleId);
  });
});

// Check URL param on page load
window.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const initialRole = params.get('role');
  if (initialRole && roleProfiles[initialRole]) {
    switchRole(initialRole);
  }
});

// ---- Parent Panel: Child Switcher ----
const childBtns = document.querySelectorAll('.child-btn');
childBtns.forEach(btn => {
  btn.addEventListener('click', () => {
    childBtns.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const child = btn.dataset.child;
    
    // Quick toast feedback
    showToast(`Switched active view to ${btn.querySelector('.child-btn__name').textContent}`);
  });
});

// ---- Parent Panel: Fee Pay Button ----
const btnPayFee = document.getElementById('btn-pay-fee');
if (btnPayFee) {
  btnPayFee.addEventListener('click', () => {
    btnPayFee.innerHTML = 'Processing Secure Payment...';
    btnPayFee.disabled = true;
    setTimeout(() => {
      btnPayFee.innerHTML = '✓ Payment Successful (₹14,500 Paid)';
      btnPayFee.style.background = '#15803d';
      showToast('Fee receipt generated! Sent to WhatsApp & email.');
    }, 1200);
  });
}

// ---- Teacher Panel: Live Roster Attendance Toggle ----
const teacherRoster = document.getElementById('teacher-roster-table');
if (teacherRoster) {
  teacherRoster.addEventListener('click', (e) => {
    if (e.target && e.target.classList.contains('btn-toggle-att')) {
      const row = e.target.closest('tr');
      const statusBadge = row.querySelector('.badge');
      const studentName = row.querySelector('strong').textContent;

      if (statusBadge.classList.contains('badge--green')) {
        statusBadge.className = 'badge badge--red';
        statusBadge.textContent = '🔴 Absent (Manual)';
        showToast(`${studentName} marked Absent. Parent alert queued.`);
      } else {
        statusBadge.className = 'badge badge--green';
        statusBadge.textContent = '🟢 Present (Manual)';
        showToast(`${studentName} marked Present.`);
      }
    }
  });
}

// ---- Teacher Panel: Student Roster Filter ----
const studentSearch = document.getElementById('student-search');
if (studentSearch) {
  studentSearch.addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const rows = document.querySelectorAll('#teacher-roster-table tbody tr');
    rows.forEach(r => {
      const text = r.textContent.toLowerCase();
      r.style.display = text.includes(q) ? '' : 'none';
    });
  });
}

// ---- Teacher Panel: Marks Entry Form ----
const teacherGradeForm = document.getElementById('teacher-grade-form');
if (teacherGradeForm) {
  teacherGradeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const student = document.getElementById('grade-student-select').value;
    const marks = document.getElementById('input-marks').value;
    showToast(`Saved ${marks}/50 for ${student}. Synced to Parent Portal!`);
  });
}

// ---- Principal Panel: Broadcast Alert ----
const btnPrincipalBroadcast = document.getElementById('btn-principal-broadcast');
if (btnPrincipalBroadcast) {
  btnPrincipalBroadcast.addEventListener('click', () => {
    const msg = prompt('Enter urgent announcement to broadcast to all 1,450 parents & staff:', 'School will close at 01:00 PM today due to heavy rain advisory.');
    if (msg) {
      showToast(`📢 Broadcast sent to 1,450 parents via SMS, App Push & WhatsApp!`);
    }
  });
}

// ---- Admin Panel: Buttons ----
const btnRegisterDevice = document.getElementById('btn-register-device');
if (btnRegisterDevice) {
  btnRegisterDevice.addEventListener('click', () => {
    showToast('NFC Reader Discovery Mode active. Waiting for device heartbeat...');
  });
}

const btnPairCard = document.getElementById('btn-pair-card');
if (btnPairCard) {
  btnPairCard.addEventListener('click', () => {
    showToast('Tap new NFC RFID card on USB programmer to pair student...');
  });
}

// ---- Toast Notification Utility ----
function showToast(message) {
  let toast = document.getElementById('portal-toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'portal-toast';
    toast.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      background: #111111;
      color: #ffffff;
      padding: 12px 20px;
      border-radius: 9999px;
      border: 1px solid rgba(50, 205, 50, 0.4);
      box-shadow: 0 10px 30px rgba(0,0,0,0.3);
      font-size: 0.85rem;
      font-weight: 600;
      z-index: 9999;
      display: flex;
      align-items: center;
      gap: 8px;
      opacity: 0;
      transform: translateY(12px);
      transition: all 0.25s ease;
      pointer-events: none;
    `;
    document.body.appendChild(toast);
  }

  toast.innerHTML = `<span style="color: #32CD32;">●</span> ${message}`;
  toast.style.opacity = '1';
  toast.style.transform = 'translateY(0)';

  clearTimeout(toast.timeoutId);
  toast.timeoutId = setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(12px)';
  }, 3200);
}
