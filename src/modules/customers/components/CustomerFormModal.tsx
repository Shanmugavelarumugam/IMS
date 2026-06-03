import React, { useState, useEffect, useRef } from 'react';
import { 
  X, 
  Building2, 
  User, 
  Plus, 
  Trash2, 
  UploadCloud, 
  Globe, 
  FileText, 
  CheckCircle2, 
  Info,
  MapPin,
  Users,
  Tag,
  Paperclip,
  Settings
} from 'lucide-react';

interface Customer {
  type: 'Distributor' | 'Wholesaler' | 'Retail Partner' | 'Key Account';
}

interface ContactPerson {
  id: string;
  salutation: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  mobile: string;
}

interface UploadedFile {
  id: string;
  name: string;
  size: string;
}

interface CustomerFormModalProps {
  showFormModal: boolean;
  setShowFormModal: (show: boolean) => void;
  editingCustomer: any;
  formName: string;
  setFormName: (val: string) => void;
  formContact: string;
  setFormContact: (val: string) => void;
  formEmail: string;
  setFormEmail: (val: string) => void;
  formPhone: string;
  setFormPhone: (val: string) => void;
  formType: Customer['type'];
  setFormType: (val: Customer['type']) => void;
  formLimit: string;
  setFormLimit: (val: string) => void;
  formRating: string;
  setFormRating: (val: string) => void;
  formAddress: string;
  setFormAddress: (val: string) => void;
  handleSaveCustomer: (e: React.FormEvent, fullCustomerData?: any) => void;
}

export const CustomerFormModal: React.FC<CustomerFormModalProps> = (props) => {
  const {
    showFormModal,
    setShowFormModal,
    editingCustomer,
    formEmail,
    setFormEmail,
    formPhone,
    setFormPhone,
    formType,
    formLimit,
    setFormLimit,
    formRating,
    setFormRating,
    formAddress,
    handleSaveCustomer,
  } = props;
  // 1. Navigation Tabs state
  const [activeTab, setActiveTab] = useState<'basic' | 'address' | 'contacts' | 'additional' | 'documents' | 'custom' | 'remarks'>('basic');

  // 2. Form states
  const [customerType, setCustomerType] = useState<'Business' | 'Individual'>('Business');
  const [salutation, setSalutation] = useState('Mr.');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [workPhone, setWorkPhone] = useState('');
  const [language, setLanguage] = useState('English');
  
  // Business Details
  const [gstTreatment, setGstTreatment] = useState('Registered Business');
  const [gstin, setGstin] = useState('');
  const [pan, setPan] = useState('');
  const [currency, setCurrency] = useState('INR');
  const [paymentTerms, setPaymentTerms] = useState('Net 30');
  const [enablePortal, setEnablePortal] = useState(false);
  const [isFetchingGst, setIsFetchingGst] = useState(false);
  const [gstSuccessMessage, setGstSuccessMessage] = useState('');

  // Address Section
  const [billingAttention, setBillingAttention] = useState('');
  const [billingCountry, setBillingCountry] = useState('India');
  const [billingAddress1, setBillingAddress1] = useState('');
  const [billingAddress2, setBillingAddress2] = useState('');
  const [billingCity, setBillingCity] = useState('');
  const [billingState, setBillingState] = useState('');
  const [billingPin, setBillingPin] = useState('');
  const [billingPhone, setBillingPhone] = useState('');
  const [billingFax, setBillingFax] = useState('');

  const [shippingAttention, setShippingAttention] = useState('');
  const [shippingCountry, setShippingCountry] = useState('India');
  const [shippingAddress1, setShippingAddress1] = useState('');
  const [shippingAddress2, setShippingAddress2] = useState('');
  const [shippingCity, setShippingCity] = useState('');
  const [shippingState, setShippingState] = useState('');
  const [shippingPin, setShippingPin] = useState('');
  const [shippingPhone, setShippingPhone] = useState('');
  const [shippingFax, setShippingFax] = useState('');
  const [sameAsBilling, setSameAsBilling] = useState(false);

  // Contact Persons Section
  const [contactPersons, setContactPersons] = useState<ContactPerson[]>([]);

  // Additional Details Section
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [department, setDepartment] = useState('');
  const [designation, setDesignation] = useState('');
  const [twitter, setTwitter] = useState('');
  const [skype, setSkype] = useState('');
  const [facebook, setFacebook] = useState('');

  // Documents Section
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Remarks, Custom Fields & Reporting Tags
  const [customCode, setCustomCode] = useState('');
  const [customRegion, setCustomRegion] = useState('');
  const [customSalesExec, setCustomSalesExec] = useState('');
  const [customIndustry, setCustomIndustry] = useState('');
  const [reportingTags, setReportingTags] = useState<string[]>([]);
  const [newTagInput, setNewTagInput] = useState('');
  const [internalNotes, setInternalNotes] = useState('');

  // Dynamic Custom Fields State
  const [dynamicCustomFields, setDynamicCustomFields] = useState<{ id: string; label: string; value: string }[]>([]);

  // Initialize form when opening/editing
  useEffect(() => {
    if (!showFormModal) return;
    
    // Reset tab to first one
    setActiveTab('basic');
    setGstSuccessMessage('');

    if (editingCustomer) {
      // Prepopulate advanced values
      setCustomerType(editingCustomer.customerType || 'Business');
      setSalutation(editingCustomer.salutation || 'Mr.');
      setFirstName(editingCustomer.firstName || '');
      setLastName(editingCustomer.lastName || '');
      setCompanyName(editingCustomer.companyName || editingCustomer.name || '');
      setDisplayName(editingCustomer.displayName || editingCustomer.name || '');
      setWorkPhone(editingCustomer.workPhone || '');
      setLanguage(editingCustomer.language || 'English');
      
      setGstTreatment(editingCustomer.gstTreatment || 'Registered Business');
      setGstin(editingCustomer.gstin || '');
      setPan(editingCustomer.pan || '');
      setCurrency(editingCustomer.currency || 'INR');
      setPaymentTerms(editingCustomer.paymentTerms || 'Net 30');
      setEnablePortal(!!editingCustomer.enablePortal);

      // Address Fields
      setBillingAttention(editingCustomer.billingAttention || editingCustomer.contactPerson || '');
      setBillingCountry(editingCustomer.billingCountry || 'India');
      setBillingAddress1(editingCustomer.billingAddress1 || '');
      setBillingAddress2(editingCustomer.billingAddress2 || '');
      setBillingCity(editingCustomer.billingCity || '');
      setBillingState(editingCustomer.billingState || '');
      setBillingPin(editingCustomer.billingPin || '');
      setBillingPhone(editingCustomer.billingPhone || editingCustomer.phone || '');
      setBillingFax(editingCustomer.billingFax || '');

      setShippingAttention(editingCustomer.shippingAttention || '');
      setShippingCountry(editingCustomer.shippingCountry || 'India');
      setShippingAddress1(editingCustomer.shippingAddress1 || '');
      setShippingAddress2(editingCustomer.shippingAddress2 || '');
      setShippingCity(editingCustomer.shippingCity || '');
      setShippingState(editingCustomer.shippingState || '');
      setShippingPin(editingCustomer.shippingPin || '');
      setShippingPhone(editingCustomer.shippingPhone || '');
      setShippingFax(editingCustomer.shippingFax || '');
      setSameAsBilling(!!editingCustomer.sameAsBilling);

      setContactPersons(editingCustomer.contactPersons || []);
      setWebsiteUrl(editingCustomer.websiteUrl || '');
      setDepartment(editingCustomer.department || '');
      setDesignation(editingCustomer.designation || '');
      setTwitter(editingCustomer.twitter || '');
      setSkype(editingCustomer.skype || '');
      setFacebook(editingCustomer.facebook || '');

      setUploadedFiles(editingCustomer.uploadedFiles || []);
      setCustomCode(editingCustomer.customCode || `CUST-${Math.floor(1000 + Math.random() * 9000)}`);
      setCustomRegion(editingCustomer.customRegion || '');
      setCustomSalesExec(editingCustomer.customSalesExec || '');
      setCustomIndustry(editingCustomer.customIndustry || '');
      setReportingTags(editingCustomer.reportingTags || []);
      setInternalNotes(editingCustomer.internalNotes || '');
      setDynamicCustomFields(editingCustomer.dynamicCustomFields || []);
    } else {
      // Default initial states for standard creation
      setCustomerType('Business');
      setSalutation('Mr.');
      setFirstName('');
      setLastName('');
      setCompanyName('');
      setDisplayName('');
      setWorkPhone('');
      setLanguage('English');
      setGstTreatment('Registered Business');
      setGstin('');
      setPan('');
      setCurrency('INR');
      setPaymentTerms('Net 30');
      setEnablePortal(false);

      setBillingAttention('');
      setBillingCountry('India');
      setBillingAddress1('');
      setBillingAddress2('');
      setBillingCity('');
      setBillingState('');
      setBillingPin('');
      setBillingPhone('');
      setBillingFax('');

      setShippingAttention('');
      setShippingCountry('India');
      setShippingAddress1('');
      setShippingAddress2('');
      setShippingCity('');
      setShippingState('');
      setShippingPin('');
      setShippingPhone('');
      setShippingFax('');
      setSameAsBilling(true);

      setContactPersons([]);
      setWebsiteUrl('');
      setDepartment('');
      setDesignation('');
      setTwitter('');
      setSkype('');
      setFacebook('');
      setUploadedFiles([]);
      
      setCustomCode(`CUST-${Math.floor(1000 + Math.random() * 9000)}`);
      setCustomRegion('');
      setCustomSalesExec('');
      setCustomIndustry('');
      setReportingTags(['Retail']);
      setInternalNotes('');
      setDynamicCustomFields([]);
    }
  }, [showFormModal, editingCustomer]);

  // Sync Same As Billing
  useEffect(() => {
    if (sameAsBilling) {
      setShippingAttention(billingAttention);
      setShippingCountry(billingCountry);
      setShippingAddress1(billingAddress1);
      setShippingAddress2(billingAddress2);
      setShippingCity(billingCity);
      setShippingState(billingState);
      setShippingPin(billingPin);
      setShippingPhone(billingPhone);
      setShippingFax(billingFax);
    }
  }, [
    sameAsBilling, 
    billingAttention, 
    billingCountry, 
    billingAddress1, 
    billingAddress2, 
    billingCity, 
    billingState, 
    billingPin, 
    billingPhone, 
    billingFax
  ]);

  if (!showFormModal) return null;

  // Auto-display name updates based on company / personal names
  const handleFirstNameChange = (val: string) => {
    setFirstName(val);
    if (customerType === 'Individual') {
      setDisplayName(`${salutation} ${val} ${lastName}`.trim());
    }
  };

  const handleLastNameChange = (val: string) => {
    setLastName(val);
    if (customerType === 'Individual') {
      setDisplayName(`${salutation} ${firstName} ${val}`.trim());
    }
  };

  const handleCompanyNameChange = (val: string) => {
    setCompanyName(val);
    if (customerType === 'Business') {
      setDisplayName(val);
    }
  };

  // Indian GSTIN Simulated Fetch
  const handleFetchGstDetails = () => {
    if (!gstin.trim() || gstin.length < 8) {
      alert("Please enter a valid GSTIN");
      return;
    }
    setIsFetchingGst(true);
    setGstSuccessMessage('');
    
    // Simulate API fetch delay
    setTimeout(() => {
      setIsFetchingGst(false);
      
      // Auto-extract PAN from GSTIN (3rd to 12th characters)
      let autoPan = '';
      if (gstin.length >= 12) {
        autoPan = gstin.substring(2, 12).toUpperCase();
        setPan(autoPan);
      }
      
      // Auto-populate based on a fake registration
      const resolvedName = gstin.startsWith("29") 
        ? "Viyan Tech Retailers Private Limited" 
        : gstin.startsWith("27")
        ? "Western Digital Enterprises Ltd"
        : "Apollo Commercial Logistics Ltd";

      setCompanyName(resolvedName);
      setDisplayName(resolvedName);
      setGstTreatment('Registered Business');
      
      // Fill Billing Address
      setBillingAttention("Account Department");
      setBillingAddress1("Corporate Tower 4, Tech Park Zone");
      setBillingAddress2("Industrial Area Block C");
      setBillingCity(gstin.startsWith("29") ? "Bengaluru" : gstin.startsWith("27") ? "Mumbai" : "New Delhi");
      setBillingState(gstin.startsWith("29") ? "Karnataka" : gstin.startsWith("27") ? "Maharashtra" : "Delhi");
      setBillingPin(gstin.startsWith("29") ? "560001" : gstin.startsWith("27") ? "400001" : "110001");
      setBillingCountry("India");

      setGstSuccessMessage('Customer details fetched successfully');
    }, 1200);
  };

  // Add Contact Person helper
  const handleAddContactPerson = () => {
    const newPerson: ContactPerson = {
      id: `cp-${Math.random().toString(36).substring(2, 9)}`,
      salutation: 'Mr.',
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      mobile: ''
    };
    setContactPersons([...contactPersons, newPerson]);
  };

  const handleUpdateContactPerson = (id: string, field: keyof ContactPerson, val: string) => {
    setContactPersons(contactPersons.map(p => p.id === id ? { ...p, [field]: val } : p));
  };

  const handleDeleteContactPerson = (id: string) => {
    setContactPersons(contactPersons.filter(p => p.id !== id));
  };

  // Upload simulation
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addUploadedFiles(e.dataTransfer.files);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addUploadedFiles(e.target.files);
    }
  };

  const addUploadedFiles = (filesList: FileList) => {
    const newFiles: UploadedFile[] = [];
    for (let i = 0; i < filesList.length; i++) {
      const file = filesList[i];
      const mbSize = (file.size / (1024 * 1024)).toFixed(1);
      newFiles.push({
        id: `file-${Math.random().toString(36).substring(2, 9)}`,
        name: file.name,
        size: `${mbSize} MB`
      });
    }
    setUploadedFiles([...uploadedFiles, ...newFiles].slice(0, 10));
  };

  const handleDeleteFile = (id: string) => {
    setUploadedFiles(uploadedFiles.filter(f => f.id !== id));
  };

  // Tags helper
  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      if (!reportingTags.includes(newTagInput.trim())) {
        setReportingTags([...reportingTags, newTagInput.trim()]);
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tag: string) => {
    setReportingTags(reportingTags.filter(t => t !== tag));
  };

  // Form Submit handler
  const handleSubmitForm = (e: React.FormEvent) => {
    e.preventDefault();

    if (!displayName.trim()) {
      alert("Display Name is required!");
      return;
    }

    // Assemble unified address string for summary compatibility
    const assembledAddress = billingAddress1 
      ? `${billingAttention ? `${billingAttention}, ` : ''}${billingAddress1}${billingAddress2 ? `, ${billingAddress2}` : ''}, ${billingCity}, ${billingState} - ${billingPin}`
      : formAddress;

    const unifiedContact = customerType === 'Individual' 
      ? `${firstName} ${lastName}`.trim() 
      : (billingAttention || firstName || companyName || 'Admin Desk');

    // Assemble expanded Zoho customer data block
    const fullCustomerData = {
      name: displayName.trim(),
      contactPerson: unifiedContact,
      email: formEmail || (customerType === 'Individual' ? formEmail : ''),
      phone: formPhone || workPhone || '',
      type: formType,
      rating: parseFloat(formRating) || 4.5,
      creditLimit: parseFloat(formLimit) || 200000,
      address: assembledAddress,
      
      // Extended fields
      customerType,
      salutation,
      firstName,
      lastName,
      companyName,
      displayName,
      workPhone,
      language,
      gstTreatment,
      gstin,
      pan,
      currency,
      paymentTerms,
      enablePortal,
      
      billingAttention,
      billingCountry,
      billingAddress1,
      billingAddress2,
      billingCity,
      billingState,
      billingPin,
      billingPhone,
      billingFax,

      shippingAttention,
      shippingCountry,
      shippingAddress1,
      shippingAddress2,
      shippingCity,
      shippingState,
      shippingPin,
      shippingPhone,
      shippingFax,
      sameAsBilling,

      contactPersons,
      websiteUrl,
      department,
      designation,
      twitter,
      skype,
      facebook,

      uploadedFiles,
      customCode,
      customRegion,
      customSalesExec,
      customIndustry,
      reportingTags,
      internalNotes,
      dynamicCustomFields,
    };

    handleSaveCustomer(e, fullCustomerData);
  };

  return (
    <div className="premium-modal-overlay">
      <div className="premium-modal-content" style={{ maxWidth: '880px', width: '95%', height: '680px', maxHeight: '90vh', display: 'flex', flexDirection: 'column' }}>
        
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid #f1f5f9',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          background: '#f8fafc'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Building2 size={22} color="#6366f1" />
            <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', margin: 0, letterSpacing: '-0.02em' }}>
              {editingCustomer ? `Edit Customer: ${editingCustomer.name}` : 'Create New Customer Node'}
            </h2>
          </div>
          <button
            onClick={() => setShowFormModal(false)}
            style={{
              border: 'none',
              background: '#ffffff',
              boxShadow: '0 2px 5px rgba(0,0,0,0.05)',
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: '#64748b',
            }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Selection Row */}
        <style>{`
          .no-scrollbar::-webkit-scrollbar {
            display: none !important;
          }
          .no-scrollbar {
            -ms-overflow-style: none !important;
            scrollbar-width: none !important;
          }
          .tab-btn {
            position: relative;
            transition: all 0.25s ease;
            outline: none;
          }
          .tab-btn::after {
            content: '';
            position: absolute;
            bottom: 0;
            left: 50%;
            width: 32px;
            margin-left: -16px;
            height: 3px;
            background-color: #4f46e5;
            border-radius: 99px;
            transform: scaleX(0);
            transition: transform 0.25s cubic-bezier(0.4, 0, 0.2, 1);
          }
          .tab-btn.active::after {
            transform: scaleX(1);
          }
        `}</style>
        <div style={{
          display: 'flex',
          overflowX: 'auto',
          borderBottom: '1.5px solid #f1f5f9',
          background: '#ffffff',
          padding: '0 16px',
          gap: '4px',
          height: '52px',
          alignItems: 'center',
          boxSizing: 'border-box'
        }} className="no-scrollbar">
          {[
            { id: 'basic', label: 'Basic Info', icon: User },
            { id: 'address', label: 'Address & Billing', icon: MapPin },
            { id: 'contacts', label: 'Contact Persons', icon: Users, disabled: customerType !== 'Business' },
            { id: 'additional', label: 'Additional Details', icon: Globe },
            { id: 'documents', label: 'Documents', icon: Paperclip },
            { id: 'custom', label: 'Custom Fields', icon: Settings },
            { id: 'remarks', label: 'Notes & Tags', icon: Tag }
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={tab.disabled}
                onClick={() => setActiveTab(tab.id as any)}
                className={`tab-btn ${isActive ? 'active' : ''}`}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '14px 16px',
                  border: 'none',
                  background: 'transparent',
                  fontWeight: isActive ? 800 : 600,
                  fontSize: '0.82rem',
                  color: tab.disabled ? '#cbd5e1' : (isActive ? '#4f46e5' : '#64748b'),
                  cursor: tab.disabled ? 'not-allowed' : 'pointer',
                  whiteSpace: 'nowrap',
                  height: '100%'
                }}
              >
                <Icon size={14} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Form Body - Scrollable */}
        <form onSubmit={handleSubmitForm} style={{ flex: 1, overflowY: 'auto', padding: '24px', display: 'flex', flexDirection: 'column', gap: '20px', boxSizing: 'border-box' }}>
          
          {/* TAB 1: BASIC INFO */}
          {activeTab === 'basic' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>1. Primary Classification</h3>
                <div style={{ display: 'flex', gap: '24px', marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem', color: '#334155', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="customerType" 
                      checked={customerType === 'Business'}
                      onChange={() => {
                        setCustomerType('Business');
                        if (companyName) setDisplayName(companyName);
                      }}
                      style={{ accentColor: '#4f46e5' }}
                    />
                    Business
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.88rem', color: '#334155', cursor: 'pointer' }}>
                    <input 
                      type="radio" 
                      name="customerType" 
                      checked={customerType === 'Individual'}
                      onChange={() => {
                        setCustomerType('Individual');
                        setDisplayName(`${salutation} ${firstName} ${lastName}`.trim());
                      }}
                      style={{ accentColor: '#4f46e5' }}
                    />
                    Individual
                  </label>
                </div>

                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Salutation</label>
                    <select className="premium-input" value={salutation} onChange={(e) => setSalutation(e.target.value)}>
                      <option value="Mr.">Mr.</option>
                      <option value="Mrs.">Mrs.</option>
                      <option value="Ms.">Ms.</option>
                      <option value="Dr.">Dr.</option>
                      <option value="Prof.">Prof.</option>
                    </select>
                  </div>
                  <div className="premium-input-group">
                    <label>First Name *</label>
                    <input 
                      type="text" 
                      className="premium-input" 
                      placeholder="First name"
                      value={firstName} 
                      onChange={(e) => handleFirstNameChange(e.target.value)} 
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Last Name</label>
                    <input 
                      type="text" 
                      className="premium-input" 
                      placeholder="Last name"
                      value={lastName} 
                      onChange={(e) => handleLastNameChange(e.target.value)} 
                    />
                  </div>
                  <div className="premium-input-group">
                    <label>Display Name *</label>
                    <input 
                      type="text" 
                      className="premium-input" 
                      placeholder="Display Name"
                      value={displayName} 
                      onChange={(e) => setDisplayName(e.target.value)} 
                      required 
                    />
                  </div>
                </div>

                {customerType === 'Business' && (
                  <div className="premium-input-group">
                    <label>Company Name</label>
                    <input 
                      type="text" 
                      className="premium-input" 
                      placeholder="Legal Enterprise registered entity name" 
                      value={companyName}
                      onChange={(e) => handleCompanyNameChange(e.target.value)}
                    />
                  </div>
                )}

                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Email Address</label>
                    <input 
                      type="email" 
                      className="premium-input" 
                      placeholder="accounts@enterprise.com" 
                      value={formEmail}
                      onChange={(e) => setFormEmail(e.target.value)}
                    />
                  </div>
                  <div className="premium-input-group">
                    <label>Mobile</label>
                    <input 
                      type="text" 
                      className="premium-input" 
                      placeholder="+91 90000 00000" 
                      value={formPhone}
                      onChange={(e) => setFormPhone(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Work Phone</label>
                    <input 
                      type="text" 
                      className="premium-input" 
                      placeholder="022-2630501" 
                      value={workPhone}
                      onChange={(e) => setWorkPhone(e.target.value)}
                    />
                  </div>
                  <div className="premium-input-group">
                    <label>Customer Language</label>
                    <select className="premium-input" value={language} onChange={(e) => setLanguage(e.target.value)}>
                      <option value="English">English</option>
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                      <option value="Telugu">Telugu (తెలుగు)</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Business details section */}
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>2. GST Details</h3>
                
                {/* Simulated India GST Fetch Banner */}
                <div style={{ 
                  background: '#f5f3ff', 
                  border: '1px solid #ddd6fe', 
                  borderRadius: '16px', 
                  padding: '16px', 
                  marginBottom: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Info size={16} color="#7c3aed" />
                    <span style={{ fontSize: '0.8rem', fontWeight: 800, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.02em' }}>GST Details</span>
                  </div>
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input 
                      type="text" 
                      placeholder="Enter 15-digit GSTIN (e.g. 29AAAAA1111A1Z1)"
                      className="premium-input"
                      style={{ flex: 1, padding: '8px 12px', fontSize: '0.82rem', background: '#ffffff' }}
                      value={gstin}
                      onChange={(e) => setGstin(e.target.value)}
                    />
                    <button
                      type="button"
                      disabled={isFetchingGst}
                      onClick={handleFetchGstDetails}
                      style={{
                        padding: '8px 16px',
                        background: 'linear-gradient(135deg, #7c3aed 0%, #6d28d9 100%)',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '10px',
                        fontWeight: 800,
                        fontSize: '0.8rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        boxShadow: '0 4px 10px rgba(124, 58, 237, 0.2)'
                      }}
                    >
                      {isFetchingGst ? 'Fetching...' : 'Fetch Details'}
                    </button>
                  </div>
                  {gstSuccessMessage && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#059669', fontSize: '0.8rem', fontWeight: 700, marginTop: '2px' }}>
                      <CheckCircle2 size={14} /> {gstSuccessMessage}
                    </div>
                  )}
                </div>

                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>GST Treatment</label>
                    <select className="premium-input" value={gstTreatment} onChange={(e) => setGstTreatment(e.target.value)}>
                      <option value="Registered Business">Registered Business - Regular</option>
                      <option value="Unregistered">Unregistered Business</option>
                      <option value="Consumer">Consumer</option>
                      <option value="Overseas">Overseas / SEZ Developer</option>
                    </select>
                  </div>
                  <div className="premium-input-group">
                    <label>PAN</label>
                    <input 
                      type="text" 
                      className="premium-input" 
                      placeholder="ABCDE1234F" 
                      value={pan}
                      onChange={(e) => setPan(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Currency</label>
                    <select className="premium-input" value={currency} onChange={(e) => setCurrency(e.target.value)}>
                      <option value="INR">Indian Rupee (INR, ₹)</option>
                      <option value="USD">US Dollar (USD, $)</option>
                      <option value="EUR">Euro (EUR, €)</option>
                      <option value="GBP">British Pound (GBP, £)</option>
                    </select>
                  </div>
                  <div className="premium-input-group">
                    <label>Payment Terms</label>
                    <select className="premium-input" value={paymentTerms} onChange={(e) => setPaymentTerms(e.target.value)}>
                      <option value="Immediate">Due Immediately</option>
                      <option value="Net 15">Net 15 days</option>
                      <option value="Net 30">Net 30 days</option>
                      <option value="Custom">Custom Terms</option>
                    </select>
                  </div>
                </div>

                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Credit Limit (₹)</label>
                    <input 
                      type="number" 
                      className="premium-input" 
                      placeholder="200000" 
                      value={formLimit}
                      onChange={(e) => setFormLimit(e.target.value)}
                    />
                  </div>
                  <div className="premium-input-group">
                    <label>Customer Rating (1-5)</label>
                    <input 
                      type="number" 
                      step="0.1" 
                      min="1" 
                      max="5"
                      className="premium-input" 
                      placeholder="4.5" 
                      value={formRating}
                      onChange={(e) => setFormRating(e.target.value)}
                    />
                  </div>
                </div>

                <div style={{ marginTop: '10px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontWeight: 700, fontSize: '0.85rem', color: '#475569', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={enablePortal} 
                      onChange={(e) => setEnablePortal(e.target.checked)}
                      style={{ width: '16px', height: '16px', accentColor: '#4f46e5' }}
                    />
                    Allow portal access for this customer
                  </label>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ADDRESSES */}
          {activeTab === 'address' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
              
              {/* Billing Address Column */}
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={16} color="#6366f1" /> Billing Address
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div className="premium-input-group" style={{ marginBottom: 0 }}>
                    <label>Attention</label>
                    <input type="text" className="premium-input" placeholder="e.g. Accounts Department" value={billingAttention} onChange={(e) => setBillingAttention(e.target.value)} />
                  </div>
                  <div className="premium-input-group" style={{ marginBottom: 0 }}>
                    <label>Country/Region</label>
                    <input type="text" className="premium-input" value={billingCountry} onChange={(e) => setBillingCountry(e.target.value)} />
                  </div>
                  <div className="premium-input-group" style={{ marginBottom: 0 }}>
                    <label>Street 1</label>
                    <input type="text" className="premium-input" placeholder="Street Address, P.O. Box" value={billingAddress1} onChange={(e) => setBillingAddress1(e.target.value)} />
                  </div>
                  <div className="premium-input-group" style={{ marginBottom: 0 }}>
                    <label>Street 2</label>
                    <input type="text" className="premium-input" placeholder="Apartment, Suite, Unit" value={billingAddress2} onChange={(e) => setBillingAddress2(e.target.value)} />
                  </div>
                  <div className="form-grid">
                    <div className="premium-input-group" style={{ marginBottom: 0 }}>
                      <label>City</label>
                      <input type="text" className="premium-input" placeholder="Bengaluru" value={billingCity} onChange={(e) => setBillingCity(e.target.value)} />
                    </div>
                    <div className="premium-input-group" style={{ marginBottom: 0 }}>
                      <label>State</label>
                      <input type="text" className="premium-input" placeholder="Karnataka" value={billingState} onChange={(e) => setBillingState(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="premium-input-group" style={{ marginBottom: 0 }}>
                      <label>Pin Code</label>
                      <input type="text" className="premium-input" placeholder="560001" value={billingPin} onChange={(e) => setBillingPin(e.target.value)} />
                    </div>
                    <div className="premium-input-group" style={{ marginBottom: 0 }}>
                      <label>Phone</label>
                      <input type="text" className="premium-input" placeholder="080-4123..." value={billingPhone} onChange={(e) => setBillingPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="premium-input-group" style={{ marginBottom: 0 }}>
                    <label>Fax Number</label>
                    <input type="text" className="premium-input" placeholder="Optional" value={billingFax} onChange={(e) => setBillingFax(e.target.value)} />
                  </div>
                </div>
              </div>

              {/* Shipping Address Column */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={16} color="#10b981" /> Shipping Address
                  </h3>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', fontWeight: 800, color: '#4f46e5', cursor: 'pointer' }}>
                    <input 
                      type="checkbox" 
                      checked={sameAsBilling} 
                      onChange={(e) => setSameAsBilling(e.target.checked)}
                      style={{ accentColor: '#4f46e5' }}
                    />
                    Same as Billing Address
                  </label>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', opacity: sameAsBilling ? 0.65 : 1, pointerEvents: sameAsBilling ? 'none' : 'auto', transition: 'all 0.2s' }}>
                  <div className="premium-input-group" style={{ marginBottom: 0 }}>
                    <label>Attention</label>
                    <input type="text" className="premium-input" placeholder="Delivery Gate Manager" value={shippingAttention} onChange={(e) => setShippingAttention(e.target.value)} />
                  </div>
                  <div className="premium-input-group" style={{ marginBottom: 0 }}>
                    <label>Country/Region</label>
                    <input type="text" className="premium-input" value={shippingCountry} onChange={(e) => setShippingCountry(e.target.value)} />
                  </div>
                  <div className="premium-input-group" style={{ marginBottom: 0 }}>
                    <label>Street 1</label>
                    <input type="text" className="premium-input" placeholder="Warehouse address" value={shippingAddress1} onChange={(e) => setShippingAddress1(e.target.value)} />
                  </div>
                  <div className="premium-input-group" style={{ marginBottom: 0 }}>
                    <label>Street 2</label>
                    <input type="text" className="premium-input" placeholder="e.g. Block D Suite 2" value={shippingAddress2} onChange={(e) => setShippingAddress2(e.target.value)} />
                  </div>
                  <div className="form-grid">
                    <div className="premium-input-group" style={{ marginBottom: 0 }}>
                      <label>City</label>
                      <input type="text" className="premium-input" placeholder="Bengaluru" value={shippingCity} onChange={(e) => setShippingCity(e.target.value)} />
                    </div>
                    <div className="premium-input-group" style={{ marginBottom: 0 }}>
                      <label>State</label>
                      <input type="text" className="premium-input" placeholder="Karnataka" value={shippingState} onChange={(e) => setShippingState(e.target.value)} />
                    </div>
                  </div>
                  <div className="form-grid">
                    <div className="premium-input-group" style={{ marginBottom: 0 }}>
                      <label>Pin Code</label>
                      <input type="text" className="premium-input" placeholder="560001" value={shippingPin} onChange={(e) => setShippingPin(e.target.value)} />
                    </div>
                    <div className="premium-input-group" style={{ marginBottom: 0 }}>
                      <label>Phone</label>
                      <input type="text" className="premium-input" placeholder="Delivery desk mobile" value={shippingPhone} onChange={(e) => setShippingPhone(e.target.value)} />
                    </div>
                  </div>
                  <div className="premium-input-group" style={{ marginBottom: 0 }}>
                    <label>Fax Number</label>
                    <input type="text" className="premium-input" placeholder="Optional" value={shippingFax} onChange={(e) => setShippingFax(e.target.value)} />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: CONTACT PERSONS */}
          {activeTab === 'contacts' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '18px', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                <div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Contact Persons</h3>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>Add additional contacts for this customer</p>
                </div>
                <button
                  type="button"
                  onClick={handleAddContactPerson}
                  style={{
                    padding: '8px 16px',
                    background: '#6366f1',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '10px',
                    fontWeight: 800,
                    fontSize: '0.78rem',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    boxShadow: '0 4px 10px rgba(99, 102, 241, 0.2)'
                  }}
                >
                  <Plus size={14} /> Add Contact Person
                </button>
              </div>

              {contactPersons.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', border: '2px dashed #e2e8f0', borderRadius: '16px', color: '#94a3b8' }}>
                  <Users size={32} style={{ marginBottom: '8px', opacity: 0.5 }} />
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, margin: 0 }}>No contact persons added</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto', border: '1px solid #e2e8f0', borderRadius: '16px' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ background: '#f8fafc', borderBottom: '1px solid #e2e8f0' }}>
                        <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Salutation</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>First Name</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Last Name</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Email</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Phone</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569' }}>Mobile</th>
                        <th style={{ padding: '12px 14px', fontWeight: 800, color: '#475569', textAlign: 'center' }}>Delete</th>
                      </tr>
                    </thead>
                    <tbody>
                      {contactPersons.map(person => (
                        <tr key={person.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '8px 10px' }}>
                            <select 
                              className="premium-input" 
                              style={{ padding: '6px', fontSize: '0.78rem', borderRadius: '8px' }}
                              value={person.salutation} 
                              onChange={(e) => handleUpdateContactPerson(person.id, 'salutation', e.target.value)}
                            >
                              <option value="Mr.">Mr.</option>
                              <option value="Mrs.">Mrs.</option>
                              <option value="Ms.">Ms.</option>
                              <option value="Dr.">Dr.</option>
                            </select>
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input 
                              type="text" 
                              className="premium-input" 
                              style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '8px', width: '90px' }}
                              placeholder="First Name" 
                              value={person.firstName}
                              onChange={(e) => handleUpdateContactPerson(person.id, 'firstName', e.target.value)}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input 
                              type="text" 
                              className="premium-input" 
                              style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '8px', width: '90px' }}
                              placeholder="Last Name" 
                              value={person.lastName}
                              onChange={(e) => handleUpdateContactPerson(person.id, 'lastName', e.target.value)}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input 
                              type="email" 
                              className="premium-input" 
                              style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '8px', width: '130px' }}
                              placeholder="email@company.com" 
                              value={person.email}
                              onChange={(e) => handleUpdateContactPerson(person.id, 'email', e.target.value)}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input 
                              type="text" 
                              className="premium-input" 
                              style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '8px', width: '100px' }}
                              placeholder="Work" 
                              value={person.phone}
                              onChange={(e) => handleUpdateContactPerson(person.id, 'phone', e.target.value)}
                            />
                          </td>
                          <td style={{ padding: '8px 10px' }}>
                            <input 
                              type="text" 
                              className="premium-input" 
                              style={{ padding: '6px 10px', fontSize: '0.78rem', borderRadius: '8px', width: '100px' }}
                              placeholder="Mobile" 
                              value={person.mobile}
                              onChange={(e) => handleUpdateContactPerson(person.id, 'mobile', e.target.value)}
                            />
                          </td>
                          <td style={{ padding: '8px 10px', textAlign: 'center' }}>
                            <button
                              type="button"
                              onClick={() => handleDeleteContactPerson(person.id)}
                              style={{ border: 'none', background: '#fef2f2', color: '#ef4444', width: '28px', height: '28px', borderRadius: '50%', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                            >
                              <Trash2 size={12} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* TAB 4: ADDITIONAL DETAILS */}
          {activeTab === 'additional' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>1. Other Details</h3>
                <div className="premium-input-group">
                  <label>Website URL</label>
                  <input type="text" className="premium-input" placeholder="https://www.viyantech.in" value={websiteUrl} onChange={(e) => setWebsiteUrl(e.target.value)} />
                </div>
                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Department</label>
                    <input type="text" className="premium-input" placeholder="e.g. Procurement, Logistics" value={department} onChange={(e) => setDepartment(e.target.value)} />
                  </div>
                  <div className="premium-input-group">
                    <label>Designation</label>
                    <input type="text" className="premium-input" placeholder="e.g. Purchase Head, VP Operations" value={designation} onChange={(e) => setDesignation(e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>2. Social Information</h3>
                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>X (Twitter)</label>
                    <input type="text" className="premium-input" placeholder="@viyanco" value={twitter} onChange={(e) => setTwitter(e.target.value)} />
                  </div>
                  <div className="premium-input-group">
                    <label>Skype ID</label>
                    <input type="text" className="premium-input" placeholder="skype_user" value={skype} onChange={(e) => setSkype(e.target.value)} />
                  </div>
                </div>
                <div className="premium-input-group">
                  <label>Facebook Page</label>
                  <input type="text" className="premium-input" placeholder="facebook.com/company" value={facebook} onChange={(e) => setFacebook(e.target.value)} />
                </div>
              </div>
            </div>
          )}

          {/* TAB 5: DOCUMENTS */}
          {activeTab === 'documents' && (
            <div>
              <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>Documents</h3>
              
              {/* Drag and Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                style={{
                  border: isDragging ? '2.5px dashed #4f46e5' : '2.5px dashed #cbd5e1',
                  background: isDragging ? '#eef2ff' : '#f8fafc',
                  borderRadius: '20px',
                  padding: '40px 20px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  boxShadow: isDragging ? '0 10px 20px -5px rgba(99, 102, 241, 0.1)' : 'none'
                }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  multiple 
                  style={{ display: 'none' }} 
                  onChange={handleFileSelect}
                  accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
                />
                <UploadCloud size={44} color="#6366f1" style={{ margin: '0 auto 12px', opacity: 0.8 }} />
                <h4 style={{ margin: '0 0 6px', fontWeight: 800, fontSize: '0.95rem', color: '#1e293b' }}>
                  Drag & Drop files here, or <span style={{ color: '#4f46e5', textDecoration: 'underline' }}>Browse Files</span>
                </h4>
                <p style={{ margin: 0, fontSize: '0.74rem', color: '#94a3b8', fontWeight: 650 }}>
                  Upload documents (Max 10 files, 10MB each)
                </p>
                <p style={{ margin: '4px 0 0', fontSize: '0.74rem', color: '#94a3b8', fontWeight: 700 }}>
                  Accepted formats: PDF, JPG, PNG, DOC
                </p>
              </div>

              {/* Uploaded Files Table list */}
              {uploadedFiles.length > 0 && (
                <div style={{ marginTop: '20px' }}>
                  <h4 style={{ fontSize: '0.8rem', fontWeight: 800, color: '#475569', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '10px' }}>Uploaded Files ({uploadedFiles.length})</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {uploadedFiles.map(file => (
                      <div 
                        key={file.id} 
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '12px 16px',
                          background: '#ffffff',
                          border: '1.5px solid #f1f5f9',
                          borderRadius: '12px',
                          boxShadow: '0 2px 4px rgba(0,0,0,0.01)'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <FileText size={18} color="#6366f1" />
                          <div>
                            <div style={{ fontSize: '0.82rem', fontWeight: 750, color: '#1e293b' }}>{file.name}</div>
                            <div style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 600 }}>{file.size}</div>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => handleDeleteFile(file.id)}
                          style={{
                            border: 'none',
                            background: '#fef2f2',
                            color: '#ef4444',
                            padding: '6px 10px',
                            borderRadius: '8px',
                            fontSize: '0.75rem',
                            fontWeight: 800,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '4px'
                          }}
                        >
                          <Trash2 size={12} /> Remove
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 6: CUSTOM FIELDS */}
          {activeTab === 'custom' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>1. Custom Fields</h3>
                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Customer Code</label>
                    <input type="text" className="premium-input" placeholder="e.g. CUST-5192" value={customCode} onChange={(e) => setCustomCode(e.target.value)} />
                  </div>
                  <div className="premium-input-group">
                    <label>Region</label>
                    <input type="text" className="premium-input" placeholder="e.g. South India, North-West" value={customRegion} onChange={(e) => setCustomRegion(e.target.value)} />
                  </div>
                </div>
                <div className="form-grid">
                  <div className="premium-input-group">
                    <label>Sales Executive</label>
                    <input type="text" className="premium-input" placeholder="e.g. Vikram Malhotra" value={customSalesExec} onChange={(e) => setCustomSalesExec(e.target.value)} />
                  </div>
                  <div className="premium-input-group">
                    <label>Industry Type</label>
                    <input type="text" className="premium-input" placeholder="e.g. Retail, FMCG, SaaS" value={customIndustry} onChange={(e) => setCustomIndustry(e.target.value)} />
                  </div>
                </div>
              </div>

              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', margin: 0, textTransform: 'uppercase', letterSpacing: '0.04em' }}>2. Dynamic Custom Fields</h3>
                  <button
                    type="button"
                    onClick={() => {
                      const newField = { id: `cf-${Math.random().toString(36).substring(2, 9)}`, label: '', value: '' };
                      setDynamicCustomFields([...dynamicCustomFields, newField]);
                    }}
                    style={{
                      padding: '6px 12px',
                      background: '#6366f1',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      fontWeight: 800,
                      fontSize: '0.74rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Plus size={12} /> Add Custom Field
                  </button>
                </div>

                {dynamicCustomFields.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '24px', border: '1.5px dashed #e2e8f0', borderRadius: '12px', color: '#94a3b8' }}>
                    <p style={{ fontSize: '0.8rem', fontWeight: 700, margin: 0 }}>No additional custom fields created.</p>
                    <p style={{ fontSize: '0.7rem', fontWeight: 650, margin: '2px 0 0' }}>Add new fields dynamically for unique metadata (e.g. "Credit Score Group", "Alternate Email").</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {dynamicCustomFields.map(field => (
                      <div key={field.id} style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input
                          type="text"
                          className="premium-input"
                          style={{ flex: 1, padding: '8px 12px', fontSize: '0.8rem' }}
                          placeholder="Field Label (e.g. Credit Rating)"
                          value={field.label}
                          onChange={(e) => {
                            setDynamicCustomFields(dynamicCustomFields.map(f => f.id === field.id ? { ...f, label: e.target.value } : f));
                          }}
                        />
                        <input
                          type="text"
                          className="premium-input"
                          style={{ flex: 2, padding: '8px 12px', fontSize: '0.8rem' }}
                          placeholder="Field Value (e.g. AA+ Premium)"
                          value={field.value}
                          onChange={(e) => {
                            setDynamicCustomFields(dynamicCustomFields.map(f => f.id === field.id ? { ...f, value: e.target.value } : f));
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => setDynamicCustomFields(dynamicCustomFields.filter(f => f.id !== field.id))}
                          style={{
                            border: 'none',
                            background: '#fef2f2',
                            color: '#ef4444',
                            width: '32px',
                            height: '32px',
                            borderRadius: '8px',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 7: REMARKS, NOTES & TAGS */}
          {activeTab === 'remarks' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>1. Reporting Tags</h3>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {reportingTags.map(tag => (
                    <span 
                      key={tag} 
                      style={{
                        background: 'rgba(99, 102, 241, 0.08)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        color: '#4f46e5',
                        padding: '6px 12px',
                        borderRadius: '20px',
                        fontSize: '0.78rem',
                        fontWeight: 800,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      {tag}
                      <button 
                        type="button" 
                        onClick={() => handleRemoveTag(tag)}
                        style={{ border: 'none', background: 'transparent', color: '#4f46e5', cursor: 'pointer', padding: 0, display: 'inline-flex', alignItems: 'center' }}
                      >
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="premium-input-group">
                  <input 
                    type="text" 
                    className="premium-input" 
                    placeholder="Type tag and press Enter (e.g. Retail, VIP, Wholesale)" 
                    value={newTagInput}
                    onChange={(e) => setNewTagInput(e.target.value)}
                    onKeyDown={handleAddTag}
                  />
                  <span style={{ fontSize: '0.7rem', color: '#94a3b8', fontWeight: 650, marginTop: '2px' }}>Press Enter to append tags to this client node.</span>
                </div>
              </div>

              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#1e293b', marginBottom: '14px', textTransform: 'uppercase', letterSpacing: '0.04em', borderBottom: '1px solid #f1f5f9', paddingBottom: '6px' }}>2. Remarks</h3>
                <div className="premium-input-group">
                  <textarea 
                    className="premium-input" 
                    style={{ height: '80px', fontFamily: 'inherit', resize: 'none' }}
                    placeholder="Describe specific preferences (e.g. Preferred customer, 30-day payment cycle, routes deliveries through South Hub)..."
                    value={internalNotes}
                    onChange={(e) => setInternalNotes(e.target.value)}
                  />
                </div>
              </div>
            </div>
          )}

        </form>

        {/* Footer actions bar */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid #f1f5f9',
          background: '#f8fafc',
          display: 'flex',
          justifyContent: 'flex-end',
          gap: '12px'
        }}>
          <button
            type="button"
            onClick={() => setShowFormModal(false)}
            style={{
              padding: '12px 20px',
              background: '#ffffff',
              border: '1.5px solid #e2e8f0',
              borderRadius: '12px',
              fontWeight: 700,
              fontSize: '0.85rem',
              color: '#475569',
              cursor: 'pointer',
            }}
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmitForm}
            style={{
              padding: '12px 28px',
              background: 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)',
              border: 'none',
              borderRadius: '12px',
              fontWeight: 800,
              fontSize: '0.85rem',
              color: '#ffffff',
              cursor: 'pointer',
              boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            }}
          >
            {editingCustomer ? 'Update Customer' : 'Save Customer'}
          </button>
        </div>

      </div>
    </div>
  );
};
