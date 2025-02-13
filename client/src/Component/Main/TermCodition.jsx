import React from "react";

const TermCodition = () => {
  return (
   <div>
    <div className=" max-h-screen overflow-y-scroll mt-2 bg-white">
      <div className="h-full w-full">
    <h2 className="p-4 text-2xl md:text-4xl font-bold">Terms of Service</h2>

{/* Terms Text */}
<div className="py-4 px-4">
  <h3 className='text-lg font-semibold mb-2'>Terms of Service for Cumulus</h3>
  <span className="break-word text-gray-700">Welcome to Cumulus. These Terms of Service ("Terms") govern your access to and use of Cumulus's services, including our web platform, mobile applications, content, features, and any related services (collectively, "the Service").</span>
  <p className="break-words text-gray-700 py-1">Please read these Terms carefully. By accessing or using the Service, you agree to comply with and be bound by these Terms and all applicable laws.</p>

  <h4 className="mb-1 mt-1 text-lg font-semibold">1. Introduction</h4>
  <ul className='break-words mb-4 text-gray-700'>
    <li><p className=" p-1">1.1 Overview:</ p> These Terms constitute a legally binding agreement between you and Cumulus. By accessing or using our Service, you accept these Terms and agree to be bound by them.</li>
    <li><p className=" p-1">1.2 Acceptance of Terms:</ p> Your use of the Service indicates that you have read, understood, and agree to be bound by these Terms, including any future modifications.</li>
    <li><p className=" p-1">1.3 Amendments to the Terms:</ p> Cumulus reserves the right to modify or amend these Terms at any time. Changes will be effective upon posting to our website or notification via the Service. Your continued use after any modifications means you accept the new Terms.</li>
  </ul>

  <h4 className="mb-1 mt-1 text-lg font-semibold">2. Eligibility and Account Registration</h4>
  <ul className='mb-2 py-2 text-gray-700'>
    <li><p className=" p-1">2.1 Eligibility Requirements:</ p> You must be at least 18 years of age to use the Service. By registering, you confirm that you meet this age requirement.</li>
    <li><p className=" p-1">2.2 Account Information:</ p> You are responsible for maintaining the confidentiality of your account login information and are fully responsible for all activities conducted through your account.</li>
    <li><p className=" p-1">2.3 Accuracy of Information:</ p> You agree to provide accurate, current, and complete information about yourself when registering. You must update your information to maintain its accuracy.</li>
  </ul>

  <h4 className="mb-1 mt-1 text-lg font-semibold">3. Subscription Plans and Fees</h4>
  <ul className='mb-2 py-2 text-gray-700'>
    <li><p className=" p-1">3.1 Subscription Tiers:</ p> Cumulus offers multiple subscription plans: Standard, Premium, and Enterprise. Subscription fees are outlined in our pricing section and may vary by tier.</li>
    <li><p className=" p-1">3.2 Billing Cycle:</ p> Subscription fees are billed either monthly or annually, depending on your selection at the time of purchase. Payments are due at the beginning of each billing cycle.</li>
    <li><p className=" p-1">3.3 Automatic Renewal:</ p> Unless you cancel your subscription, your plan will automatically renew at the end of each billing cycle. You can manage renewal settings through your account.</li>
    <li><p className=" p-1">3.4 Payment Methods:</ p> By subscribing, you authorize Cumulus to charge your provided payment method for the fees associated with your selected subscription.</li>
    <li><p className=" p-1">3.5 Refund Policy:</ p> Subscription fees are non-refundable. Partial refunds are not available if you terminate your subscription before the end of a billing cycle.</li>
  </ul>

  <h4 className="mb-1 mt-1 text-lg font-semibold">4. Use of Service</h4>
  <ul className='mb-2 py-2 text-gray-700'>
    <li><p className="p-1">4.1 Permitted Use:</ p> The Service is intended solely for your personal, non-commercial use unless otherwise agreed. You agree to use the Service only as permitted by these Terms.</li>
    <li><p className="p-1">4.2 Prohibited Use:</ p> You agree not to:
      <ul>
        <li>Engage in any activity that interferes with or disrupts the Service.</li>
        <li>Attempt to gain unauthorized access to our systems.</li>
        <li>Reverse engineer or disassemble any part of the Service.</li>
      </ul>
    </li>
    <li><p className="p-1">4.3 User Responsibilities:</ p> You are responsible for your use of the Service and any data you share or upload. You agree not to misuse the Service in any way.</li>
  </ul>

  <h4 className="mb-1 mt-1 text-lg font-semibold">5. User Content and Intellectual Property</h4>
  <ul className='mb-2 py-2 text-gray-700'>
    <li><p className=" p-1">5.1 Ownership of User Content:</ p> You retain ownership of all content you upload to Cumulus. By uploading, you grant Cumulus a non-exclusive, worldwide, royalty-free license to use, store, and process your content for the purpose of providing the Service.</li>
    <li><p className=" p-1">5.2 License Restrictions:</ p> You may not distribute, modify, transmit, reuse, download, repost, or use the content of the Service without Cumulus's prior written permission.</li>
    <li><p className=" p-1">5.3 Intellectual Property Rights:</ p> All trademarks, logos, and service marks displayed through the Service are the property of Cumulus or third parties. You are not permitted to use them without prior consent.</li>
  </ul>

  <h4 className="mb-1 mt-1 text-lg font-semibold">6. Privacy and Security</h4>
  <ul className='mb-2 py-2 text-gray-700'>
    <li><p className="p-1">6.1 Data Collection:</ p> By using Cumulus, you acknowledge and agree that we may collect and use your data as described in our Privacy Policy.</li>
    <li><p className="p-1">6.2 Data Protection:</ p> We use industry-standard encryption and security protocols to protect your data. However, Cumulus cannot guarantee that unauthorized third parties will never be able to defeat our security measures.</li>
    <li><p className="p-1">6.3 User Rights:</ p> Under applicable data protection laws, you may have the right to request access to, modification of, or deletion of your personal data.</li>
  </ul>

  <h4 className="mb-1 mt-1 text-lg font-semibold">7. Termination of Service</h4>
  <ul className='mb-2 py-2 text-gray-700'>
    <li><p className="p-1">7.1 Termination by You:</ p> You may terminate your account at any time. Please note that any unused subscription period will not be refunded.</li>
    <li><p className="p-1">7.2 Termination by Cumulus:</ p> We reserve the right to terminate or suspend your account immediately, without notice, for conduct that violates these Terms or is harmful to other users of the Service.</li>
    <li><p className="p-1">7.3 Effect of Termination:</ p> Upon termination, your right to use the Service will immediately cease. All of your data and content may be deleted within a reasonable time, except as otherwise required by law.</li>
  </ul>

  <h4 className="mb-1 mt-1 text-lg font-semibold">8. Limitation of Liability</h4>
  <ul className='mb-2 py-2 text-gray-700'>
    <li><p className="p-1">8.1 No Warranty:</ p> The Service is provided "as is" and "as available." Cumulus makes no warranties, either express or implied, regarding the Service, including any implied warranties of merchantability or fitness for a particular purpose.</li>
    <li><p className="p-1">8.2 Limitation on Damages:</ p> To the extent permitted by law, Cumulus shall not be liable for any indirect, incidental, or consequential damages arising from the use of the Service.</li>
  </ul>

  <h4 className="mb-1 mt-1 text-lg font-semibold">9. Dispute Resolution and Governing Law</h4>
  <ul className='mb-2 py-2 text-gray-700'>
    <li><p className="p-1">9.1 Governing Law:</ p> These Terms are governed by the laws of [Jurisdiction], without regard to its conflict of laws principles.</li>
    <li><p className="p-1">9.2 Arbitration:</ p> Any dispute arising from these Terms will be settled by arbitration in [Location], and you consent to personal jurisdiction in [Location] for the purposes of arbitrating such disputes.</li>
  </ul>

  <h4 className="mb-1 mt-1 text-lg font-semibold">10. General Provisions</h4>
  <ul className='mb-2 py-2 text-gray-700'>
    <li><p className="p-1">10.1 Entire Agreement:</ p> These Terms constitute the entire agreement between you and Cumulus with respect to your use of the Service.</li>
    <li><p className="p-1">10.2 Severability:</ p> If any part of these Terms is held invalid or unenforceable, that part will be construed to reflect the parties' original intent, and the remaining portions will remain in full force.</li>
    <li><p className="p-1">10.3 Waiver:</ p> No waiver by Cumulus of any breach of these Terms shall be a waiver of any preceding or succeeding breach.</li>
  </ul>

  <h4 className="mb-1 mt-1 text-lg font-semibold">11. Contact Information</h4>
  <ul className='mb-2 py-2 text-gray-700'>
    <li><p className="p-1">11.1 Contact Us:</ p> If you have questions or concerns regarding these Terms, please contact us at support@cumulus.rip.</li>
  </ul>
</div>
</div>
    </div>
   </div>
  );
};

export default TermCodition;
