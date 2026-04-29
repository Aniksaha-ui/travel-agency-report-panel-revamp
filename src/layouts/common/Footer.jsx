export default function Footer() {
  return (
    <footer className="footer footer-transparent d-print-none app-footer">
      <div className="container-xl">
        <div className="row text-center align-items-center flex-row-reverse">
          <div className="col-lg-auto ms-lg-auto">
            <ul className="list-inline list-inline-dots mb-0">
              <li className="list-inline-item">
                <a
                  href="https://tabler.io/docs"
                  target="_blank"
                  className="link-secondary"
                  rel="noopener noreferrer"
                >
                  Documentation
                </a>
              </li>
              <li className="list-inline-item">
                <a
                  href="https://github.com/tabler/tabler"
                  target="_blank"
                  className="link-secondary"
                  rel="noopener noreferrer"
                >
                  Source code
                </a>
              </li>
            </ul>
          </div>
          <div className="col-12 col-lg-auto mt-3 mt-lg-0">
            <ul className="list-inline list-inline-dots mb-0">
              <li className="list-inline-item">
                Copyright © 2026 SkyRoute Admin. All rights reserved.
              </li>
              <li className="list-inline-item">
                <span className="link-secondary">v1.0.0</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}
