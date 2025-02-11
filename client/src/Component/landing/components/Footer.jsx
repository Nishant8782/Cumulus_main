import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Linkedin, X } from 'lucide-react';
import logo2 from"../Assets/logo2.png";
import { Link as ScrollLink } from "react-scroll";

function Footer() {
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isDialogOpen2, setDialogOpen2] = useState(false);

  useEffect(() => {
    // Disable body scrolling when the dialog is open
    if (isDialogOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Reset on unmount
    };
  }, [isDialogOpen]);

  return (
    <footer className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-8">
          {/* Logo and Social Media */}
          <div className="flex flex-col items-start">
            <h1 className="flex item-start">
              <div>
                <ScrollLink
                  to="home"
                  smooth={true}
                  duration={1000}
                  offset={0}
                  className=" cursor-pointer text-lg"
                >
                  <img src={logo2} alt="" className='h-12' />
                </ScrollLink>
              </div>


            </h1>
            <div className="flex items-center space-x-4 mt-4">
              <div className="flex space-x-4">
                <a
                  href="https://www.facebook.com/people/Cumulusrip/61568592287663/?mibextid=wwXIfr&rdid=jrWM0LjyBHdnRjPy&share_url=https%3A%2F%2Fwww.facebook.com%2Fshare%2F18SWVu8zzy%2F%3Fmibextid%3DwwXIfr"
                  className="text-gray-600 cursor-pointer hover:text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="https://x.com/cumulus_storage?s=21&t=TrGJxI9PFd51mfG5IP7grg"
                  className="text-gray-600 cursor-pointer hover:text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="https://www.instagram.com/cumulus.rip?igsh=b3VmejZnbjR5Ym9s"
                  className="text-gray-600 cursor-pointer hover:text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="https://www.linkedin.com/in/cumulus-rip"
                  className="text-gray-600 cursor-pointer hover:text-blue-500"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

          </div>

          {/* Menu Links */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-medium text-gray-800">Menu</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <ScrollLink
                  to="features"
                  smooth={true}
                  duration={1000}
                  offset={-50}
                  className="text-gray-600 cursor-pointer hover:text-blue-500 focus:outline-none"
                >
                  Features
                </ScrollLink>
              </li>
              <li>
                <ScrollLink
                  to="subscription"
                  smooth={true}
                  duration={500}
                  offset={-50}
                  className="text-gray-600 cursor-pointer hover:text-blue-500 focus:outline-none"
                >
                  Plans & Pricing
                </ScrollLink>
              </li>
            </ul>
          </div>

          {/* Legal Links */}
          <div className="flex flex-col items-start">
            <h3 className="text-lg font-medium text-gray-800">Legal</h3>
            <ul className="mt-4 space-y-2">
              <li>
                <button
                  onClick={() => setDialogOpen(true)}
                  className="text-gray-600 cursor-pointer hover:text-blue-500 focus:outline-none"
                >
                  Terms & Conditions
                </button>
              </li>
              <li>
                <button
                  onClick={() => setDialogOpen2(true)}
                  className="text-gray-600 cursor-pointer hover:text-blue-500 focus:outline-none"
                >
                  Privacy Policy
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Text */}
      <div className="mt-10 text-center text-gray-500">
        © Cumulus 2024
      </div>

      {/* Dialog Box */}
      {isDialogOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex  items-center justify-center z-50 p-3 md:p-0">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl relative">
            {/* Close Icon */}
            <button
              className="absolute top-3 right-5 md:top-3 md:right-3 text-gray-600 hover:text-black"
              onClick={() => setDialogOpen(false)}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-black">Terms of Service</h2>

            {/* Terms Text */}
            <pre className="text-xs md:text-lg text-black max-h-[80vh]  overflow-y-scroll break-words mb-4 whitespace-normal font-sans">
              <h3 className='font-semibold text-lg mb-4'>Terms of Service for Cumulus</h3>
              <p>Welcome to Cumulus. These Terms of Service ("Terms") govern your access to and use of Cumulus's services, including our web platform, mobile applications, content, features, and any related services (collectively, "the Service").</p>
              <p>Please read these Terms carefully. By accessing or using the Service, you agree to comply with and be bound by these Terms and all applicable laws.</p>

              <h4>1. Introduction</h4>
              <ul className='mb-4 px-2 py-2'>
                <li><strong>1.1 Overview:</strong> These Terms constitute a legally binding agreement between you and Cumulus. By accessing or using our Service, you accept these Terms and agree to be bound by them.</li>
                <li><strong>1.2 Acceptance of Terms:</strong> Your use of the Service indicates that you have read, understood, and agree to be bound by these Terms, including any future modifications.</li>
                <li><strong>1.3 Amendments to the Terms:</strong> Cumulus reserves the right to modify or amend these Terms at any time. Changes will be effective upon posting to our website or notification via the Service. Your continued use after any modifications means you accept the new Terms.</li>
              </ul>

              <h4>2. Eligibility and Account Registration</h4>
              <ul className='mb-4 px-2 py-2'>
                <li><strong>2.1 Eligibility Requirements:</strong> You must be at least 18 years of age to use the Service. By registering, you confirm that you meet this age requirement.</li>
                <li><strong>2.2 Account Information:</strong> You are responsible for maintaining the confidentiality of your account login information and are fully responsible for all activities conducted through your account.</li>
                <li><strong>2.3 Accuracy of Information:</strong> You agree to provide accurate, current, and complete information about yourself when registering. You must update your information to maintain its accuracy.</li>
              </ul>

              <h4>3. Subscription Plans and Fees</h4>
              <ul className='mb-4 px-2 py-2'>
                <li><strong>3.1 Subscription Tiers:</strong> Cumulus offers multiple subscription plans: Standard, Premium, and Enterprise. Subscription fees are outlined in our pricing section and may vary by tier.</li>
                <li><strong>3.2 Billing Cycle:</strong> Subscription fees are billed either monthly or annually, depending on your selection at the time of purchase. Payments are due at the beginning of each billing cycle.</li>
                <li><strong>3.3 Automatic Renewal:</strong> Unless you cancel your subscription, your plan will automatically renew at the end of each billing cycle. You can manage renewal settings through your account.</li>
                <li><strong>3.4 Payment Methods:</strong> By subscribing, you authorize Cumulus to charge your provided payment method for the fees associated with your selected subscription.</li>
                <li><strong>3.5 Refund Policy:</strong> Subscription fees are non-refundable. Partial refunds are not available if you terminate your subscription before the end of a billing cycle.</li>
              </ul>

              <h4>4. Use of Service</h4>
              <ul className='mb-4 px-2 py-2'>
                <li><strong>4.1 Permitted Use:</strong> The Service is intended solely for your personal, non-commercial use unless otherwise agreed. You agree to use the Service only as permitted by these Terms.</li>
                <li><strong>4.2 Prohibited Use:</strong> You agree not to:
                  <ul>
                    <li>Engage in any activity that interferes with or disrupts the Service.</li>
                    <li>Attempt to gain unauthorized access to our systems.</li>
                    <li>Reverse engineer or disassemble any part of the Service.</li>
                  </ul>
                </li>
                <li><strong>4.3 User Responsibilities:</strong> You are responsible for your use of the Service and any data you share or upload. You agree not to misuse the Service in any way.</li>
              </ul>

              <h4>5. User Content and Intellectual Property</h4>
              <ul className='mb-4 px-2 py-2'>
                <li><strong>5.1 Ownership of User Content:</strong> You retain ownership of all content you upload to Cumulus. By uploading, you grant Cumulus a non-exclusive, worldwide, royalty-free license to use, store, and process your content for the purpose of providing the Service.</li>
                <li><strong>5.2 License Restrictions:</strong> You may not distribute, modify, transmit, reuse, download, repost, or use the content of the Service without Cumulus's prior written permission.</li>
                <li><strong>5.3 Intellectual Property Rights:</strong> All trademarks, logos, and service marks displayed through the Service are the property of Cumulus or third parties. You are not permitted to use them without prior consent.</li>
              </ul>

              <h4>6. Privacy and Security</h4>
              <ul className='mb-4 px-2 py-2'>
                <li><strong>6.1 Data Collection:</strong> By using Cumulus, you acknowledge and agree that we may collect and use your data as described in our Privacy Policy.</li>
                <li><strong>6.2 Data Protection:</strong> We use industry-standard encryption and security protocols to protect your data. However, Cumulus cannot guarantee that unauthorized third parties will never be able to defeat our security measures.</li>
                <li><strong>6.3 User Rights:</strong> Under applicable data protection laws, you may have the right to request access to, modification of, or deletion of your personal data.</li>
              </ul>

              <h4>7. Termination of Service</h4>
              <ul className='mb-4 px-2 py-2'>
                <li><strong>7.1 Termination by You:</strong> You may terminate your account at any time. Please note that any unused subscription period will not be refunded.</li>
                <li><strong>7.2 Termination by Cumulus:</strong> We reserve the right to terminate or suspend your account immediately, without notice, for conduct that violates these Terms or is harmful to other users of the Service.</li>
                <li><strong>7.3 Effect of Termination:</strong> Upon termination, your right to use the Service will immediately cease. All of your data and content may be deleted within a reasonable time, except as otherwise required by law.</li>
              </ul>

              <h4>8. Limitation of Liability</h4>
              <ul className='mb-4 px-2 py-2'>
                <li><strong>8.1 No Warranty:</strong> The Service is provided "as is" and "as available." Cumulus makes no warranties, either express or implied, regarding the Service, including any implied warranties of merchantability or fitness for a particular purpose.</li>
                <li><strong>8.2 Limitation on Damages:</strong> To the extent permitted by law, Cumulus shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Service.</li>
              </ul>

              <h4>9. Dispute Resolution and Governing Law</h4>
              <ul className='mb-4 px-2 py-2'>
                <li><strong>9.1 Governing Law:</strong> These Terms are governed by the laws of [Jurisdiction], without regard to its conflict of laws principles.</li>
                <li><strong>9.2 Arbitration:</strong> Any dispute arising from these Terms will be settled by arbitration in [Location], and you consent to personal jurisdiction in [Location] for the purposes of arbitrating such disputes.</li>
              </ul>

              <h4>10. General Provisions</h4>
              <ul className='mb-4 px-2 py-2'>
                <li><strong>10.1 Entire Agreement:</strong> These Terms constitute the entire agreement between you and Cumulus with respect to your use of the Service.</li>
                <li><strong>10.2 Severability:</strong> If any part of these Terms is held invalid or unenforceable, that part will be construed to reflect the parties' original intent, and the remaining portions will remain in full force.</li>
                <li><strong>10.3 Waiver:</strong> No waiver by Cumulus of any breach of these Terms shall be a waiver of any preceding or succeeding breach.</li>
              </ul>

              <h4>11. Contact Information</h4>
              <ul className='mb-4 px-2 py-2'>
                <li><strong>11.1 Contact Us:</strong> If you have questions or concerns regarding these Terms, please contact us at support@cumulus.rip.</li>
              </ul>
            </pre>



            {/* Checkbox */}
            {/* <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="acceptTerms"
                className="h-4 w-4 border-gray-300 rounded"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                By signing this, you agree to the Privacy Policy and Terms of Service.
              </label>
            </div> */}

            {/* Buttons */}
            {/* <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-sm bg-white border border-blue-500 text-blue-500 rounded-md hover:bg-gray-400"
                onClick={() => setDialogOpen(false)}
              >
                Decline
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => setDialogOpen(false)}
              >
                I Agree
              </button>
            </div> */}
          </div>
        </div>
      )}


      {isDialogOpen2 && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex  items-center justify-center z-50 p-3 md:p-0">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-7xl relative">
            {/* Close Icon */}
            <button
              className="absolute top-3 right-5 md:top-3 md:right-3 text-gray-600 hover:text-black"
              onClick={() => setDialogOpen2(false)}
            >
              <X className="h-6 w-6" />
            </button>

            {/* Title */}
            <h2 className="text-2xl font-bold mb-4 text-black">Privacy</h2>

            {/* privacy Text */}
            <pre className="text-xs md:text-lg text-gray-600 max-h-[80vh]  overflow-y-scroll break-words mb-4 whitespace-normal font-sans">
              <strong>Privacy Policy for Cumulus</strong>
              <p className='mb-4'>Welcome to Cumulus. This Privacy Policy ("Policy") explains how we collect, use, disclose, and safeguard your information when you visit our website, use our mobile application, or engage with any of our services (collectively, "the Service").
                By accessing or using the Service, you agree to the terms outlined in this Policy. If you do not agree with the terms, please do not use our Service.</p>

              <h1> <strong>1. Information We Collect</strong></h1>
              <ul className='mb-4 px-2 py-2'>
                <li> <strong>1.1 Personal Information</strong>
                  We may collect personal information that identifies you directly, including but not limited to:
                  <li> Contact Information: Name, email address, phone number, and home address.</li>
                  <li> Account Details: Username, password, and subscription details.</li>
                  <li> Payment Information: Billing address and payment method details (stored securely and encrypted).</li></li>
                <li><strong>1.2 Non-Personal Information</strong>
                  We collect non-personal information about your usage of the Service, such as:
                  o Usage Data: IP address, browser type, device type, pages visited, and time spent on the Service.
                  o Cookies and Tracking Technologies: We use cookies and other technologies to enhance your experience and gather analytical data.</li>
                <li> <strong>1.3 Voice Memos and Uploaded Content</strong>
                  If you use features like voice memos or upload documents, we store these in a secure manner to provide you with the core functionality of Cumulus.</li></ul>

              <h1><strong>2. How We Use Your Information</strong></h1>
              <ul className='mb-4 px-2 py-2'> <li><strong>2.1 Provide and Manage the Service</strong>
                o To deliver and manage our Service and to ensure smooth access to your account.
                o To process your subscription and manage billing.</li>
                <li> <strong>2.2 Improve User Experience</strong>
                  o To personalize your experience and provide you with tailored content.
                  o To conduct analytics to understand how our users interact with our platform and improve it accordingly.</li>
                <li> <strong>2.3 Communication</strong>
                  o To respond to inquiries and provide customer support.
                  o To send you important updates, notifications, and promotional offers (you can opt out of marketing communications at any time).</li>
                <li> <strong>2.4 Legal and Compliance</strong>
                  o To comply with applicable legal obligations.
                  o To enforce our Terms of Service and prevent misuse of the platform.</li></ul>

              <ul className='mb-4 px-2 py-2'> <h1><strong>3. Sharing Your Information</strong></h1>
                <li> <strong>3.1 Third-Party Service Providers</strong>
                  We may share your information with trusted third-party service providers who assist us in delivering the Service, such as:
                  o Payment Processors: To process payments and manage billing.
                  o Cloud Storage Providers: To securely store your uploaded files and voice memos.</li>
                <li> <strong>3.2 Legal Requirements</strong>
                  We may disclose your information if required by law, to respond to legal process, or to protect the rights, property, and safety of Cumulus and our users.</li>
                <li> <strong>3.3 Business Transfers</strong>
                  In the event of a merger, acquisition, or sale of our business, your personal information may be transferred to the new owner.</li></ul>

              <h1> <strong>4. Cookies and Tracking Technologies</strong></h1>
              <ul className='mb-4 px-2 py-2'> <li> <strong>4.1 Cookies</strong>
                We use cookies to collect data for analytics, to remember your preferences, and to enhance your experience on our platform. You can adjust your browser settings to reject cookies, but this may affect the functionality of the Service.</li>
                <li> <strong>4.2 Analytics</strong>
                  We use third-party services like Google Analytics to analyze usage patterns and improve our Service.</li></ul>

              <h1> <strong>5. Data Security</strong></h1>
              <ul className='mb-4 px-2 py-2'> <li> <strong>5.1 Protection Measures</strong>
                We implement industry-standard encryption (such as AES-256) and secure data transmission protocols to protect your personal information.</li>
                <li> <strong>5.2 Limited Access</strong>
                  Access to your information is restricted to authorized employees, contractors, and agents who need to know that information to operate or enhance the Service.</li></ul>

              <h1> <strong>6. Data Retention</strong></h1>
              <ul className='mb-4 px-2 py-2'> <li> <strong>6.1 Retention Period</strong>
                We retain your personal information for as long as is necessary to fulfill the purposes outlined in this Policy. We may retain some data for a longer period if required for legal compliance or to resolve disputes.</li>
                <li> <strong>6.2 Account Termination</strong>
                  If you terminate your account, we will delete or anonymize your personal information, except for data that we are required to retain by law.</li></ul>

              <h1> <strong>7. Your Rights and Choices</strong></h1>
              <ul className='mb-4 px-2 py-2'> <li> <strong>7.1 Access and Correction</strong>
                You have the right to access and correct the information we hold about you. You can do this by logging into your account or contacting us directly.</li>
                <li> <strong>7.2 Data Portability</strong>
                  You have the right to request a copy of your personal data in a structured, commonly used, and machine-readable format.</li>
                <li> <strong>7.3 Deletion</strong>
                  You can request the deletion of your personal data. However, certain data may need to be retained for legal compliance.</li>
                <li> <strong>7.4 Opt-Out of Marketing</strong>
                  You can opt-out of receiving marketing emails by following the unsubscribe link in those emails.</li></ul>

              <h1> <strong>8. Children's Privacy</strong></h1>
              <li className='mb-4 px-2 py-2'>Our Service is not intended for use by individuals under the age of 18. We do not knowingly collect personal information from minors. If we become aware of any data collected from minors, we will take steps to delete such information.</li>

              <h1> <strong>9. International Data Transfers</strong></h1>
              <li className='mb-4 px-2 py-2'>Your information may be transferred and stored on servers located outside of your country of residence. By using our Service, you consent to such international transfers of your data. We will ensure that adequate safeguards are in place to protect your data.</li>

              <h1> <strong>10. Changes to This Privacy Policy</strong></h1>
              <li className='mb-4 px-2 py-2'>We may update this Privacy Policy from time to time. Any changes will be effective upon posting to our website, and we will notify you of any significant changes through email or by a notice on the Service.</li>

              <h1> <strong>11. Contact Us</strong></h1>
              <li className='mb-4 px-2 py-2'>If you have any questions or concerns about this Privacy Policy, please contact us at:
                Cumulus Support Team
                Email: support@cumulus.rip</li>

              <h1><strong>12. California and GDPR Residents</strong></h1>
              <ul className='mb-4 px-2 py-2'> <li> <strong>12.1 California Consumer Privacy Act (CCPA)</strong>
                If you are a resident of California, you have the right to request:
                o Access: Details about the personal data we collect and use.
                o Deletion: Erasure of personal data under certain conditions.
                o Opt-Out: Refusal of the sale of your personal information.
                To exercise these rights, please contact us as outlined in Section 11.</li>
                <li> <strong>12.2 General Data Protection Regulation (GDPR)</strong>
                  If you are located in the European Economic Area (EEA), you have certain rights, including:
                  o Access, Correction, and Deletion: You may request access to or correction/deletion of your personal data.
                  o Objection: You may object to the processing of your data for specific reasons.
                  For inquiries or exercising these rights, contact us at [insert email address].</li></ul>

              <h1> <strong>13. Data Breach Notification</strong></h1>
              <li className='mb-4 px-2 py-2'>In the event of a data breach, we will promptly notify affected users and the relevant regulatory authorities, as required by applicable data protection laws. We will take all necessary measures to mitigate the impact of such a breach and prevent future occurrences.</li>
            </pre>





            {/* Checkbox */}
            {/* <div className="flex items-center space-x-2 mb-4">
              <input
                type="checkbox"
                id="acceptTerms"
                className="h-4 w-4 border-gray-300 rounded"
              />
              <label htmlFor="acceptTerms" className="text-sm text-gray-600">
                By signing this, you agree to the Privacy Policy and Terms of Service.
              </label>
            </div> */}

            {/* Buttons */}
            {/* <div className="flex justify-end space-x-4">
              <button
                className="px-4 py-2 text-sm bg-white border border-blue-500 text-blue-500 rounded-md hover:bg-gray-400"
                onClick={() => setDialogOpen(false)}
              >
                Decline
              </button>
              <button
                className="px-4 py-2 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600"
                onClick={() => setDialogOpen(false)}
              >
                I Agree
              </button>
            </div> */}
          </div>
        </div>
      )}
    </footer>
  );
}

export default Footer;
