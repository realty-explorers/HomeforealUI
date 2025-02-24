const TermsOfService = ({}) => {
  return (
    <div className="bg-gray-50 p-6 rounded-xl">
      <h3 className="font-semibold text-lg mb-4">Terms of Service</h3>
      <div className="space-y-4 text-sm text-gray-600 pr-2">
        <p>
          Welcome to our Real Estate Platform! By using our services, you agree
          to:
        </p>
        {/* Common Terms of Use Sections */}
        <details className="mb-4">
          <summary className="font-medium text-gray-700 cursor-pointer">
            Account Usage
          </summary>
          <div className="mt-2">
            <p>
              You are responsible for maintaining the confidentiality of your
              account and password and for restricting access to your computer.
              You agree to accept responsibility for all activities that occur
              under your account or password.
            </p>
          </div>
        </details>
        {/* More sections here */}
        <details className="mb-4">
          <summary className="font-medium text-gray-700 cursor-pointer">
            Disclaimer of Warranties
          </summary>
          <div className="mt-2">
            <p>
              Our platform is provided on an "as is" and "as available" basis,
              without any warranties of any kind, either express or implied. We
              do not warrant that the platform will be error-free, secure, or
              uninterrupted.
            </p>
          </div>
        </details>

        {/* BUYER DISCLAIMER AGREEMENT */}
        <h4 className="font-semibold text-md mt-6 mb-2">
          Buyer Disclaimer Agreement
        </h4>
        <p className="mb-2">Realty Explorers</p>
        <p className="mb-4">
          By checking the box and clicking "Accept," you (the "Buyer")
          acknowledge, understand, and irrevocably agree to the following
          legally binding terms governing Realty Explorers’s (the "Company")
          role and compensation structure in facilitating introductions to
          properties of interest:
        </p>

        <details className="mb-4">
          <summary className="font-medium text-gray-700 cursor-pointer">
            1. Limited Representation and Introduction Services
          </summary>
          <div className="mt-2">
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                The Buyer expressly agrees that Realty Explorers is not a
                licensed real estate broker or agent and does not engage in
                brokerage services, real estate negotiations, property
                inspections, or transaction facilitation beyond the scope of the
                introduction services described herein.
              </li>
              <li>
                The Company’s sole function is to introduce the Buyer to the
                designated seller’s agent (the “Listing Agent”) and to provide
                property analysis based on available data, at the Buyer’s
                request.
              </li>
              <li>
                Upon making such an introduction, Realty Explorers shall have no
                further obligations or duties to the Buyer, and all ensuing
                communications, negotiations, due diligence, financing,
                inspections, and contractual matters shall be exclusively
                handled between the Buyer and the Listing Agent.
              </li>
            </ol>
          </div>
        </details>

        <details className="mb-4">
          <summary className="font-medium text-gray-700 cursor-pointer">
            2. Compensation Structure and Buyer’s Cash Back Benefit
          </summary>
          <div className="mt-2">
            <ol className="list-decimal pl-5 space-y-2">
              <li>
                The Buyer acknowledges and agrees that Realty Explorers is
                entitled to receive the buyer’s agent commission (the
                “Commission”) offered by the Listing Agent as compensation for
                its role in facilitating the introduction.
              </li>
              <li>
                The Commission shall be paid at closing from the transaction
                proceeds and shall be recognized and categorized as a finder’s
                fee rather than a commission for brokerage services. Realty
                Explorers and the Buyer shall equally split the Commission
                (50-50). After the closing of the transaction, Realty Explorers
                shall send the Buyer their portion of the Commission as a
                cash-back payment, to be issued within seven (7) business days
                after the deal is finalized.
              </li>
              <li>
                The Buyer irrevocably agrees not to engage another buyer’s agent
                or attempt to bypass Realty Explorers’s compensation structure
                by circumventing its introduction services.
              </li>
              <li>
                If, despite entering into this Agreement, the Buyer proceeds to
                purchase a property that Realty Explorers introduced without
                ensuring payment of the agreed-upon finder’s fee, the Buyer
                shall remain personally liable for the fee and shall remit the
                amount due within seven (7) business days following the closing
                of the transaction.
              </li>
            </ol>
          </div>
        </details>

        <details className="mb-4">
          <summary className="font-medium text-gray-700 cursor-pointer">
            3. Non-Participation in Transaction
          </summary>
          <div className="mt-2">
            <p>3.1. Realty Explorers does not:</p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Conduct negotiations on behalf of the Buyer.</li>
              <li>Provide legal, financial, or real estate advice.</li>
              <li>
                Participate in any due diligence, inspections, title reviews, or
                closing proceedings.
              </li>
              <li>
                Guarantee the accuracy of property information or financial
                projections.
              </li>
            </ul>
            <p>
              3.2. The Buyer assumes full responsibility for all aspects of the
              transaction and is encouraged to seek independent legal,
              financial, and real estate advisory services before proceeding
              with any purchase.
            </p>
          </div>
        </details>

        <details className="mb-4">
          <summary className="font-medium text-gray-700 cursor-pointer">
            4. Indemnification and Release of Liability
          </summary>
          <div className="mt-2">
            <p>
              4.1. The Buyer hereby waives, releases, and holds harmless Realty
              Explorers, its affiliates, owners, employees, contractors, and
              agents from any and all claims, liabilities, losses, or damages
              arising from:
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>The introduction to the Listing Agent.</li>
              <li>The purchase or attempted purchase of any property.</li>
              <li>
                Any misrepresentation, omission, or inaccuracy in property
                listings or analysis.
              </li>
              <li>
                Any dispute with the Listing Agent, seller, lender, or other
                parties involved in the transaction.
              </li>
            </ul>
            <p>
              4.2. The Buyer indemnifies Realty Explorers against any legal
              action arising from breach of this Agreement, including failure to
              remit the agreed-upon finder’s fee.
            </p>
          </div>
        </details>

        <details className="mb-4">
          <summary className="font-medium text-gray-700 cursor-pointer">
            5. Governing Law and Dispute Resolution
          </summary>
          <div className="mt-2">
            <p>
              5.1. This Agreement shall be governed by and construed in
              accordance with the laws of the United States and any applicable
              state laws where the transaction occurs, without regard to
              conflicts of law principles.
            </p>
            <p>
              5.2. Any disputes arising under or relating to this Agreement
              shall be resolved exclusively through binding arbitration in
              Delaware, under the rules of the Delaware Rapid Arbitration Act
              (DRAA).
            </p>
            <p>
              5.3. In the event of any legal proceedings initiated to enforce
              Realty Explorers’s right to compensation, the Buyer shall be
              liable for all reasonable attorneys’ fees and court costs incurred
              by Realty Explorers.
            </p>
          </div>
        </details>

        <details className="mb-4">
          <summary className="font-medium text-gray-700 cursor-pointer">
            6. Acknowledgment & Acceptance
          </summary>
          <div className="mt-2">
            <p>
              By checking the box and clicking "Accept," the Buyer confirms that
              they have read, understood, and agreed to be legally bound by the
              terms of this Agreement.
            </p>
          </div>
        </details>

        {/* Common Terms of Use Bottom Section */}
        <p className="text-xs mt-4">
          For the complete terms, please{' '}
          <a
            href="/terms"
            className="text-primary hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            visit our website.
          </a>
        </p>
      </div>
    </div>
  );
};

export default TermsOfService;
