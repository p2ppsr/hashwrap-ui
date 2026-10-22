This UI is for a user to retrieve SPV BEEF and Envelope(deprecated) formats when they enter their TXID. To demonstrate the improved efficiency of the BEEF format, the length of each is displayed showing the improved reduction as a percentage.

To reduce the calls to `hashwrap` the results are cached for the page.

![Screenshot from 2024-07-18 13-42-33](https://github.com/user-attachments/assets/1d67c731-ce1c-4149-a412-d56475c8737a)


## October2026 Node build security maintenance

Retained build tooling uses Node22.23.4 and the existing frozen dependency lock.
Historical npm6 peer resolution is retained. PR CI verifies the patched native
Node/Brotli runtime and builds the retained source; registry fetches are bounded
and failures remain failures. Application dependency versions and browser
contracts are unchanged. The obsolete Cloud Run deployment is retained only as
a non-executable reference at `docs/legacy-cloud-run-deploy.yaml.txt`. This source
update cannot recreate that legacy Cloud Run service. A working build does not
establish application or production-restoration acceptance.
